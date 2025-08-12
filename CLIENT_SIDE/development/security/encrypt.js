// C:\LIVEKIT_PROJECT\CLIENT_SIDE\development\security\encrypt.js

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class Encryption {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.secretKey = this.deriveKey();
    }

    deriveKey() {
        // Derive key from hardware ID and static salt
        const HardwareID = require('../hardware_id');
        const hardwareId = HardwareID.getHardwareId();
        const salt = 'LIVEKIT-PROFESSIONAL-2024';
        
        return crypto.pbkdf2Sync(hardwareId, salt, 100000, 32, 'sha256');
    }

    encryptData(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
        
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        return {
            encrypted,
            authTag: authTag.toString('hex'),
            iv: iv.toString('hex')
        };
    }

    decryptData(encryptedData) {
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.secretKey,
            Buffer.from(encryptedData.iv, 'hex')
        );
        
        decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
        
        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    }

    encryptFile(inputPath, outputPath) {
        const fileContent = fs.readFileSync(inputPath, 'utf8');
        const encrypted = this.encryptData(fileContent);
        
        fs.writeFileSync(outputPath, JSON.stringify(encrypted));
    }

    decryptFile(inputPath, outputPath) {
        const encryptedData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
        const decrypted = this.decryptData(encryptedData);
        
        fs.writeFileSync(outputPath, decrypted);
    }
}

module.exports = new Encryption();
