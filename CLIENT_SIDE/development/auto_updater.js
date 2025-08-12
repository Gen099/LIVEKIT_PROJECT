// C:\LIVEKIT_PROJECT\CLIENT_SIDE\development\auto_updater.js

const { autoUpdater } = require('electron-updater');
const { app, dialog } = require('electron');

class AutoUpdater {
    constructor() {
        this.setupUpdater();
    }

    setupUpdater() {
        // Configure update server
        autoUpdater.setFeedURL({
            provider: 'generic',
            url: 'https://your-update-server.com/updates'
        });

        // Check for updates every hour
        setInterval(() => {
            autoUpdater.checkForUpdates();
        }, 3600000);

        // Event handlers
        autoUpdater.on('checking-for-update', () => {
            console.log('Checking for updates...');
        });

        autoUpdater.on('update-available', (info) => {
            console.log('Update available:', info.version);
        });

        autoUpdater.on('update-not-available', () => {
            console.log('No updates available');
        });

        autoUpdater.on('error', (err) => {
            console.error('Update error:', err);
        });

        autoUpdater.on('download-progress', (progressObj) => {
            let message = `Download speed: ${progressObj.bytesPerSecond}`;
            message += ` - Downloaded ${progressObj.percent}%`;
            message += ` (${progressObj.transferred}/${progressObj.total})`;
            console.log(message);
        });

        autoUpdater.on('update-downloaded', (info) => {
            dialog.showMessageBox({
                type: 'info',
                title: 'Update Ready',
                message: 'A new version has been downloaded. Restart to apply the update?',
                buttons: ['Restart', 'Later']
            }).then((result) => {
                if (result.response === 0) {
                    autoUpdater.quitAndInstall();
                }
            });
        });
    }

    checkForUpdates() {
        autoUpdater.checkForUpdatesAndNotify();
    }
}

module.exports = new AutoUpdater();
