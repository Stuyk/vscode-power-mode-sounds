const vscode = require('vscode');
const { exec } = require('child_process');
const { readdirSync } = require('fs');
const path = require('path');

let documentChanger;
let sounds = [];

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const disposable = vscode.commands.registerCommand(
        'extension.activatePowerModeSounds',
        registerSounds
    );

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function registerSounds() {
    sounds = [];
    const files = readdirSync(path.join(__dirname, '/sounds'));
    files.forEach(file => {
        if (!file.includes('.mp3')) {
            return;
        }

        sounds.push(file);
    });

    documentChanger = vscode.workspace.onDidChangeTextDocument(
        onDocumentChangeEvent
    );

    vscode.window.showInformationMessage(`Loaded ${sounds.length} Sounds!`);
}

function onDocumentChangeEvent() {
    const soundName = sounds[Math.floor(Math.random() * sounds.length)];
    exec(
        `ffplay ${path.join(
            __dirname,
            '/sounds/'
        )}${soundName} -nodisp -autoexit`,
        (err, std, stderr) => {}
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
