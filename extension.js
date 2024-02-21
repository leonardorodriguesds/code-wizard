const vscode = require('vscode');
const EvoMenuDataProvider = require('./modules/menu/leftmenu.js');
const insertCommands = require('./modules/commands')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "evo-code-wizard" is now active!');

	const evoMenuDataProvider = new EvoMenuDataProvider();
    vscode.window.registerTreeDataProvider('evoView', evoMenuDataProvider);

	insertCommands(context);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
