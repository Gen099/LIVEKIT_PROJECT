// C:\LIVEKIT_PROJECT\CLIENT_SIDE\development\main.js

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');
const isDev = process.env.NODE_ENV === 'development';

// Import custom modules
const HardwareID = require('./hardware_id');
const ProxyManager = require('./proxy_manager');
const TelegramAlert = require('./telegram_alert');
const { encryptData, decryptData } = require('./security/encrypt');

// Global variables
let mainWindow;
let licenseData = null;
let hardwareId = null;

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

// Create main window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1000,
        minHeight: 700,
        icon: path.join(__dirname, 'assets/icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        frame: false,
        titleBarStyle: 'hidden',
        backgroundColor: '#1a1a2e'
    });

    mainWindow.loadFile('index.html');

    // Prevent debugging in production
    if (!isDev) {
        mainWindow.webContents.on('devtools-opened', () => {
            mainWindow.webContents.closeDevTools();
        });

        // Disable right-click context menu
        mainWindow.webContents.on('context-menu', (e) => {
            e.preventDefault();
        });
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Initialize hardware ID
    initializeHardware();
}

// Initialize hardware fingerprint
async function initializeHardware() {
    try {
        hardwareId = await HardwareID.getHardwareId();
        console.log('Hardware ID initialized:', hardwareId);
    } catch (error) {
        console.error('Failed to get hardware ID:', error);
        dialog.showErrorBox('Initialization Error', 'Failed to initialize hardware fingerprint');
        app.quit();
    }
}

// App event handlers
app.whenReady().then(() => {
    createWindow();
    
    // Check for updates
    if (!isDev) {
        autoUpdater.checkForUpdatesAndNotify();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// IPC Handlers

// Window controls
ipcMain.handle('minimize-window', () => {
    mainWindow.minimize();
});

ipcMain.handle('maximize-window', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.handle('close-window', () => {
    app.quit();
});

// Get hardware ID
ipcMain.handle('get-hardware-id', async () => {
    return hardwareId;
});

// Validate license
ipcMain.handle('validate-license', async (event, licenseKey) => {
    try {
        const response = await fetch('http://localhost:3000/api/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                licenseKey,
                hardwareId
            })
        });

        const data = await response.json();

        if (data.valid) {
            // Store license data encrypted
            licenseData = data;
            const encryptedData = encryptData(JSON.stringify(data));
            fs.writeFileSync(
                path.join(app.getPath('userData'), 'license.dat'),
                encryptedData
            );

            // Send success alert
            await TelegramAlert.sendAlert({
                type: 'LICENSE_ACTIVATED',
                licenseKey,
                hardwareId,
                packageType: data.packageType
            });
        }

        return data;
    } catch (error) {
        console.error('License validation error:', error);
        return { valid: false, error: 'Connection failed' };
    }
});

// Load saved license
ipcMain.handle('load-saved-license', async () => {
    try {
        const licensePath = path.join(app.getPath('userData'), 'license.dat');
        
        if (!fs.existsSync(licensePath)) {
            return null;
        }

        const encryptedData = fs.readFileSync(licensePath, 'utf8');
        const decryptedData = decryptData(encryptedData);
        const savedLicense = JSON.parse(decryptedData);

        // Re-validate with server
        const response = await fetch('http://localhost:3000/api/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                licenseKey: savedLicense.licenseKey,
                hardwareId
            })
        });

        const data = await response.json();
        
        if (data.valid) {
            licenseData = data;
            return data;
        } else {
            // Remove invalid license
            fs.unlinkSync(licensePath);
            return null;
        }
    } catch (error) {
        console.error('Failed to load saved license:', error);
        return null;
    }
});

// Launch account
ipcMain.handle('launch-account', async (event, accountNumber) => {
    if (!licenseData || !licenseData.valid) {
        return { success: false, error: 'Invalid license' };
    }

    const maxAccounts = licenseData.packageType === 'BASIC' ? 3 :
                       licenseData.packageType === 'PRO' ? 5 : 10;

    if (accountNumber > maxAccounts) {
        return { success: false, error: 'Account number exceeds package limit' };
    }

    try {
        // Get proxy configuration
        const proxyConfig = await ProxyManager.getProxyForAccount(accountNumber);
        
        // Setup SocksCap64 with proxy
        const socksCapPath = path.join(__dirname, `../../packages/${licenseData.packageType}/accounts/Account_${accountNumber}/sockscap64`);
        await ProxyManager.configureSocksCap(socksCapPath, proxyConfig);

        // Launch OBS with SocksCap64
        const obsPath = path.join(__dirname, `../../packages/${licenseData.packageType}/accounts/Account_${accountNumber}/obs-studio/bin/64bit`);
        const launchSuccess = await ProxyManager.launchWithProxy(obsPath, socksCapPath, accountNumber);

        if (launchSuccess) {
            // Log successful launch
            await TelegramAlert.sendAlert({
                type: 'ACCOUNT_LAUNCHED',
                accountNumber,
                packageType: licenseData.packageType
            });

            return { success: true };
        } else {
            return { success: false, error: 'Failed to launch application' };
        }
    } catch (error) {
        console.error('Launch error:', error);
        return { success: false, error: error.message };
    }
});

// Get package info
ipcMain.handle('get-package-info', () => {
    return licenseData;
});

// Auto-updater events
autoUpdater.on('update-available', () => {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Available',
        message: 'A new version is available. It will be downloaded in the background.',
        buttons: ['OK']
    });
});

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message: 'Update downloaded. The application will restart to apply the update.',
        buttons: ['Restart Now', 'Later']
    }).then((result) => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    });
});

// Anti-tampering check
setInterval(() => {
    if (!isDev) {
        const integrityCheck = require('./security/integrity_check');
        if (!integrityCheck.verify()) {
            dialog.showErrorBox('Security Error', 'Application integrity check failed');
            app.quit();
        }
    }
}, 60000); // Check every minute
