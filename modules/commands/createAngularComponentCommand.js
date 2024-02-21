const vscode = require('vscode');
const fs = require('fs').promises; 
const path = require('path');

async function createAngularComponent() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage("Nenhum workspace aberto.");
        return;
    }

    let basePath = await vscode.window.showInputBox({ prompt: "Informe o caminho relativo dentro do workspace onde o componente será criado. Deixe em branco para criar na raiz principal da evo" });
    const componentNameInput = await vscode.window.showInputBox({ prompt: "Informe o nome do componente" });

    if (!componentNameInput) {
        vscode.window.showErrorMessage("Caminho ou nome do componente não informado.");
        return;
    }

    if (!basePath) {
        basePath = '';
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;

    try {
        const { fileName, className } = formatComponentName(componentNameInput);
        const fullPath = path.join(workspacePath, basePath, 'src/main/webapp/app/evo', fileName);
        await fs.mkdir(fullPath, { recursive: true });
        const tsFilePath = path.join(fullPath, `${fileName}.component.ts`);

        let tsContent = `import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-${fileName}',
  templateUrl: './${fileName}.component.html',
  styleUrls: ['./${fileName}.component.scss']
})
export class ${className} implements OnInit {

  constructor() { }

  ngOnInit() {
    this.setupCrud();
  }

  setupCrud() {
    // {{IMPLEMENTAR CRUD}}
  }
}`;

        await fs.writeFile(tsFilePath, tsContent);
        await fs.writeFile(path.join(fullPath, `${fileName}.component.html`), `<p>${fileName} works!</p>`);
        await fs.writeFile(path.join(fullPath, `${fileName}.component.scss`), ``);

        const document = await vscode.workspace.openTextDocument(tsFilePath);
        const editor = await vscode.window.showTextDocument(document);

        // Encontrar a linha com o comentário {{IMPLEMENTAR CRUD}}
        const line = tsContent.split('\n').findIndex(line => line.includes('{{IMPLEMENTAR CRUD}}'));
        const character = 0; // Começo da linha
        const position = new vscode.Position(line, character);
        editor.selection = new vscode.Selection(position, position);

        // Aguardar um breve momento antes de remover o comentário para garantir que o editor esteja pronto
        setTimeout(() => {
            editor.edit(async (editBuilder) => {
                const lineContent = document.lineAt(line).text;
                const newText = lineContent.replace(/\/\/\s+\{\{IMPLEMENTAR CRUD\}\}/, '');
                editBuilder.replace(new vscode.Range(line, 0, line, lineContent.length), newText);
                await vscode.commands.executeCommand('evo-code-wizard.insertCrudParams');
            });
        }, 100);

        vscode.window.showInformationMessage("Componente Angular criado com sucesso.");
    } catch (error) {
        vscode.window.showErrorMessage(`Erro ao criar o componente: ${error}`);
    }
}

function formatComponentName(inputName) {
    let name = inputName.replace(/^Evo/, '');

    const fileName = name.replace(/\.?([A-Z]+)/g, function (x, y) {
        return "-" + y.toLowerCase()
    }).replace(/^[-]/, '');

    const className = `Evo${name.charAt(0).toUpperCase() + name.slice(1)}Component`;

    return { fileName, className };
}

module.exports = createAngularComponent;
