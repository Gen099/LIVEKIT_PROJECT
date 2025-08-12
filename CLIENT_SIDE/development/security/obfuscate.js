// C:\LIVEKIT_PROJECT\CLIENT_SIDE\development\security\obfuscate.js

const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

class CodeObfuscator {
    constructor() {
        this.options = {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: true,
            debugProtectionInterval: true,
            disableConsoleOutput: true,
            domainLock: [],
            identifierNamesGenerator: 'hexadecimal',
            identifiersPrefix: 'lk',
            inputFileName: '',
            log: false,
            numbersToExpressions: true,
            renameGlobals: true,
            renameProperties: false,
            reservedNames: [],
            reservedStrings: [],
            rotateStringArray: true,
            seed: 0,
            selfDefending: true,
            shuffleStringArray: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayEncoding: ['base64', 'rc4'],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 2,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 4,
            stringArrayWrappersType: 'function',
            stringArrayThreshold: 0.75,
            target: 'node',
            transformObjectKeys: true,
            unicodeEscapeSequence: false
        };
    }

    obfuscateFile(inputPath, outputPath) {
        try {
            const code = fs.readFileSync(inputPath, 'utf8');
            const obfuscatedCode = this.obfuscateCode(code);
            fs.writeFileSync(outputPath, obfuscatedCode);
            return true;
        } catch (error) {
            console.error('Obfuscation failed:', error);
            return false;
        }
    }

    obfuscateCode(code) {
        const obfuscationResult = JavaScriptObfuscator.obfuscate(code, this.options);
        return obfuscationResult.getObfuscatedCode();
    }

    obfuscateDirectory(dirPath, outputDir) {
        const files = fs.readdirSync(dirPath);
        
        files.forEach(file => {
            if (file.endsWith('.js')) {
                const inputPath = path.join(dirPath, file);
                const outputPath = path.join(outputDir, file);
                
                this.obfuscateFile(inputPath, outputPath);
                console.log(`Obfuscated: ${file}`);
            }
        });
    }

    // Add anti-debugging code
    addAntiDebugging(code) {
        const antiDebugCode = `
        (function() {
            const devtools = {open: false, orientation: null};
            const threshold = 160;
            setInterval(function() {
                if (window.outerHeight - window.innerHeight > threshold || 
                    window.outerWidth - window.innerWidth > threshold) {
                    if (!devtools.open) {
                        devtools.open = true;
                        window.location.reload();
                    }
                }
            }, 500);

            // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J
            document.addEventListener('keydown', function(e) {
                if (e.keyCode === 123 || 
                    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
                    (e.ctrlKey && e.keyCode === 85)) {
                    e.preventDefault();
                    return false;
                }
            });

            // Disable right-click
            document.addEventListener('contextmenu', e => e.preventDefault());

            // Detect debugger
            setInterval(function() {
                const start = performance.now();
                debugger;
                const end = performance.now();
                if (end - start > 100) {
                    window.location.reload();
                }
            }, 1000);
        })();
        `;

        return antiDebugCode + '\n' + code;
    }
}

module.exports = new CodeObfuscator();
