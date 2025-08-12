// C:\LIVEKIT_PROJECT\CLIENT_SIDE\development\telegram_alert.js

const https = require('https');

class TelegramAlert {
    constructor() {
        this.botToken = '8390489997:AAFq3GKLU_SwoBboY3ZrxS9-UlpsHJJ0Qw4'; // Replace with your bot token
        this.chatId = '@SonLiveKitBot';
        this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
    }

    async sendAlert(data) {
        try {
            const message = this.formatMessage(data);
            
            const postData = JSON.stringify({
                chat_id: this.chatId,
                text: message,
                parse_mode: 'HTML'
            });

            const options = {
                hostname: 'api.telegram.org',
                port: 443,
                path: `/bot${this.botToken}/sendMessage`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            return new Promise((resolve, reject) => {
                const req = https.request(options, (res) => {
                    let data = '';
                    res.on('data', (chunk) => data += chunk);
                    res.on('end', () => resolve(JSON.parse(data)));
                });

                req.on('error', reject);
                req.write(postData);
                req.end();
            });
        } catch (error) {
            console.error('Failed to send Telegram alert:', error);
        }
    }

    formatMessage(data) {
        const timestamp = new Date().toLocaleString();
        
        switch (data.type) {
            case 'LICENSE_ACTIVATED':
                return `🔑 <b>License Activated</b>\n` +
                       `Time: ${timestamp}\n` +
                       `License: ${data.licenseKey}\n` +
                       `Package: ${data.packageType}\n` +
                       `Hardware: ${data.hardwareId}`;
                       
            case 'ACCOUNT_LAUNCHED':
                return `🚀 <b>Account Launched</b>\n` +
                       `Time: ${timestamp}\n` +
                       `Account: #${data.accountNumber}\n` +
                       `Package: ${data.packageType}`;
                       
            case 'SUSPICIOUS_ACTIVITY':
                return `⚠️ <b>Suspicious Activity Detected</b>\n` +
                       `Time: ${timestamp}\n` +
                       `Details: ${data.details}\n` +
                       `Hardware: ${data.hardwareId}`;
                       
            default:
                return `📢 <b>System Alert</b>\n` +
                       `Time: ${timestamp}\n` +
                       `Message: ${JSON.stringify(data)}`;
        }
    }
}

module.exports = new TelegramAlert();
