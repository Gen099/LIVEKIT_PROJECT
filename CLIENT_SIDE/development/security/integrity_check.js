// C:\LIVEKIT_PROJECT\CLIENT_SIDE\development\security\integrity_check.js

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class IntegrityChecker {
    constructor() {
        this.hashesFile = path.join(__dirname, 'file_hashes.json');
        this.criticalFiles = [
            'main.js',
            'preload.js',
            'index.html',
            'hardware_id.js',
            'proxy_manager.js'
        ];
    }

    generateHashes() {
        const hashes = {};
        
        this.criticalFiles.forEach(file => {
            const filePath = path.join(__dirname, '..', file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath);
                const hash = crypto.createHash('sha256').update(content).digest('hex');
                hashes[file] = hash;
            }
        });

        fs.writeFileSync(this.hashesFile, JSON.stringify(hashes, null, 2));
        return hashes;
    }

    verify() {
        try {
            if (!fs.existsSync(this.hashesFile)) {
                // First run, generate hashes
                this.generateHashes();
                return true;
            }

            const storedHashes = JSON.parse(fs.readFileSync(this.hashesFile, 'utf8'));
            
            for (const file of this.criticalFiles) {
                const filePath = path.join(__dirname, '..', file);
                
                if (!fs.existsSync(filePath)) {
                    console.error(`Critical file missing: ${file}`);
                    return false;
                }

                const content = fs.readFileSync(filePath);
                const currentHash = crypto.createHash('sha256').update(content).digest('hex');
                
                if (storedHashes[file] && storedHashes[file] !== currentHash) {
                    console.error(`File integrity check failed: ${file}`);
                    return false;
                }
            }

            return true;
        } catch (error) {
            console.error('Integrity check error:', error);
            return false;
        }
    }

    protectFile(filePath) {
        try {
            // Make file read-only
            fs.chmodSync(filePath, '444');
            
            // Hide file on Windows
            if (process.platform === 'win32') {
                const { exec } = require('child_process');
                exec(`attrib +h +s "${filePath}"`);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to protect file:', error);
            return false;
        }
    }

    checkMemoryPatches() {
        // Check for common memory patching techniques
        const checkPoints = [
            () => {
                // Check if console.log has been modified
                const originalLog = console.log.toString();
                return originalLog.includes('[native code]');
            },
            () => {
                // Check if debugger statement works normally
                try {
                    const start = Date.now();
                    debugger;
                    const elapsed = Date.now() - start;
                    return elapsed < 100;
                } catch {
                    return false;
                }
            }
        ];

        return checkPoints.every(check => check());
    }
}

module.exports = new IntegrityChecker();
