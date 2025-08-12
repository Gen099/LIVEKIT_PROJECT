// C:\LIVEKIT_PROJECT\CLIENT_SIDE\development\hardware_id.js

const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');

class HardwareID {
    static getHardwareId() {
        try {
            const components = [];
            
            // Get CPU ID
            const cpuId = this.getCpuId();
            if (cpuId) components.push(cpuId);
            
            // Get motherboard serial
            const motherboardSerial = this.getMotherboardSerial();
            if (motherboardSerial) components.push(motherboardSerial);
            
            // Get primary MAC address
            const macAddress = this.getMacAddress();
            if (macAddress) components.push(macAddress);
            
            // Get system UUID
            const systemUuid = this.getSystemUuid();
            if (systemUuid) components.push(systemUuid);
            
            // Generate fingerprint
            const fingerprint = components.join('-');
            const hash = crypto.createHash('sha256').update(fingerprint).digest('hex');
            
            // Return shortened hash
            return hash.substring(0, 16).toUpperCase();
        } catch (error) {
            console.error('Error generating hardware ID:', error);
            // Fallback to basic ID
            return this.getFallbackId();
        }
    }

    static getCpuId() {
        try {
            if (process.platform === 'win32') {
                const output = execSync('wmic cpu get ProcessorId', { encoding: 'utf8' });
                const lines = output.split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed && trimmed !== 'ProcessorId') {
                        return trimmed;
                    }
                }
            }
        } catch (error) {
            console.error('Failed to get CPU ID:', error);
        }
        return null;
    }

    static getMotherboardSerial() {
        try {
            if (process.platform === 'win32') {
                const output = execSync('wmic baseboard get SerialNumber', { encoding: 'utf8' });
                const lines = output.split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed && trimmed !== 'SerialNumber' && trimmed !== 'To be filled by O.E.M.') {
                        return trimmed;
                    }
                }
            }
        } catch (error) {
            console.error('Failed to get motherboard serial:', error);
        }
        return null;
    }

    static getMacAddress() {
        try {
            const networkInterfaces = os.networkInterfaces();
            for (const interfaceName in networkInterfaces) {
                const interfaces = networkInterfaces[interfaceName];
                for (const iface of interfaces) {
                    if (!iface.internal && iface.mac && iface.mac !== '00:00:00:00:00:00') {
                        return iface.mac.toUpperCase().replace(/:/g, '');
                    }
                }
            }
        } catch (error) {
            console.error('Failed to get MAC address:', error);
        }
        return null;
    }

    static getSystemUuid() {
        try {
            if (process.platform === 'win32') {
                const output = execSync('wmic csproduct get UUID', { encoding: 'utf8' });
                const lines = output.split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed && trimmed !== 'UUID') {
                        return trimmed;
                    }
                }
            }
        } catch (error) {
            console.error('Failed to get system UUID:', error);
        }
        return null;
    }

    static getFallbackId() {
        // Fallback using hostname and username
        const hostname = os.hostname();
        const username = os.userInfo().username;
        const platform = os.platform();
        const arch = os.arch();
        
        const fallbackString = `${hostname}-${username}-${platform}-${arch}`;
        const hash = crypto.createHash('sha256').update(fallbackString).digest('hex');
        
        return hash.substring(0, 16).toUpperCase();
    }

    static async verifyHardwareId(storedId) {
        const currentId = this.getHardwareId();
        return currentId === storedId;
    }
}

module.exports = HardwareID;
