// C:\LIVEKIT_PROJECT\CLIENT_SIDE\development\sockscap_manager.js

const fs = require('fs');
const path = require('path');

class SocksCapManager {
    constructor() {
        this.proxies = [
            { host: '192.168.1.100', port: 1080, user: 'user1', pass: 'pass1' },
            { host: '192.168.1.101', port: 1080, user: 'user2', pass: 'pass2' },
            { host: '192.168.1.102', port: 1080, user: 'user3', pass: 'pass3' },
            // Thêm proxy cho các account khác
        ];
    }
    
    generateConfig(accountIndex) {
        const proxy = this.proxies[accountIndex - 1];
        if (!proxy) return null;
        
        const config = {
            proxy_type: "SOCKS5",
            proxy_host: proxy.host,
            proxy_port: proxy.port,
            username: proxy.user,
            password: proxy.pass,
            applications: [
                {
                    path: "obs64.exe",
                    force_proxy: true
                }
            ]
        };
        
        const configPath = path.join(
            __dirname, 
            '..', 
            'packages', 
            'accounts', 
            `Account_${accountIndex}`, 
            'sockscap_config.json'
        );
        
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log(`✅ Config created for Account ${accountIndex}`);
        return configPath;
    }
    
    launchWithProxy(accountIndex) {
        const { exec } = require('child_process');
        const accountPath = path.join(
            __dirname,
            '..',
            'packages',
            'accounts',
            `Account_${accountIndex}`
        );
        
        // Launch SocksCap64 with config
        const socksCapPath = path.join(accountPath, 'sockscap64', 'SocksCap64_x64.exe');
        const configPath = path.join(accountPath, 'sockscap_config.json');
        const obsPath = path.join(accountPath, 'obs-studio', 'bin', '64bit', 'obs64.exe');
        
        // Command to launch OBS through SocksCap64
        const command = `"${socksCapPath}" -c "${configPath}" "${obsPath}" --portable`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error launching Account ${accountIndex}:`, error);
            } else {
                console.log(`✅ Account ${accountIndex} launched successfully`);
            }
        });
    }
}

module.exports = SocksCapManager;