const vscode = require('vscode');
const insertCrudParams = require('./insertCrudParams');
const createAngularComponent = require('./createAngularComponentCommand');

function insertCommands(context) {
    let insertCrudParams_invoque = vscode.commands.registerCommand('evo-code-wizard.insertCrudParams', function () {
        insertCrudParams();
    });

    context.subscriptions.push(insertCrudParams_invoque);

    let createAngularComponent_invoque = vscode.commands.registerCommand('evo-code-wizard.createAngularComponent', function () {
        createAngularComponent();
    });

    context.subscriptions.push(createAngularComponent_invoque);

    let openFileDisposable = vscode.commands.registerCommand('evo-code-wizard.openFile', async (filePath) => {
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
    });

    context.subscriptions.push(openFileDisposable);
}

module.exports = insertCommands