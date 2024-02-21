const vscode = require('vscode');
const path = require('path');
const fs = require('fs').promises;

class EvoMenuDataProvider {
    constructor() {
        this.evoCrudItems = [];
    }

    async getChildren(element) {
        if (!element) {
            // Raiz do menu lateral
            return [
                new EvoCrudItem("Evo crud's", vscode.TreeItemCollapsibleState.Collapsed),
                new EvoCrudActionsItem("Evo Wizard", vscode.TreeItemCollapsibleState.Expanded)
            ];
        } else if (element.label === "Evo crud's") {
            // Busca por componentes que utilizam <evo-ui-crud>
            if (this.evoCrudItems.length === 0) {
                await this.findEvoCrudComponents();
            }
            return this.evoCrudItems;
        } else if (element.label === 'Evo Wizard') {
            return [
                new EvoCrudActionItem('Criar novo crud', {
                    command: 'evo-code-wizard.createAngularComponent',
                    title: 'Criar novo crud',
                })
            ];
        }
        return [];
    }

    getTreeItem(element) {
        return element;
    }

    async findEvoCrudComponents() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) return;
        const evoPath = path.join(workspaceFolders[0].uri.fsPath, 'src/main/webapp/app/evo');
        await this.searchEvoUiCrudInDirectory(evoPath);
    }

    async searchEvoUiCrudInDirectory(dir) {
        try {
            const files = await fs.readdir(dir, { withFileTypes: true });
            for (const file of files) {
                if (file.isDirectory()) {
                    await this.searchEvoUiCrudInDirectory(path.join(dir, file.name));
                } else if (file.name.endsWith('.html')) {
                    const filePath = path.join(dir, file.name);
                    const content = await fs.readFile(filePath, 'utf8');
                    if (content.includes('<evo-ui-crud') || content.match(/<evo-ui-crud\s+[\s\S]*?>/)) {
                        const tsFileName = file.name.replace('.html', '.ts');
                        const tsFilePath = path.join(dir, tsFileName);
                        this.evoCrudItems.push(new EvoCrudFileItem(tsFileName, tsFilePath));
                    }
                }
            }
        } catch (error) {
            console.error('Error searching for evo-ui-crud components:', error);
        }
    }
}

class EvoCrudFileItem extends vscode.TreeItem {
    constructor(label, filePath) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.tooltip = filePath;
        this.iconPath = new vscode.ThemeIcon('explorer-view-icon'); 
        this.command = {
            command: 'evo-code-wizard.openFile',
            title: 'Open File',
            arguments: [filePath]
        };
        this.contextValue = 'file';
    }
}

class EvoCrudItem extends vscode.TreeItem {
    constructor(label, collapsibleState) {
        super(label, collapsibleState);
        this.iconPath = new vscode.ThemeIcon("list-tree");
        this.command = collapsibleState === vscode.TreeItemCollapsibleState.None ? { command: "evo-code-wizard.addComments", title: "Adicionar Comentários", arguments: [] } : undefined;
    }
}

class EvoCrudActionsItem extends vscode.TreeItem {
    constructor(label, collapsibleState) {
        super(label, collapsibleState);
        this.iconPath = new vscode.ThemeIcon("play");
        this.command = collapsibleState === vscode.TreeItemCollapsibleState.None ? { command: "evo-code-wizard.addComments", title: "Adicionar Comentários", arguments: [] } : undefined;
    }
}

class EvoCrudActionItem extends vscode.TreeItem {
    constructor(label, command) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.iconPath = new vscode.ThemeIcon("play");
        this.command = command;
    }
}

module.exports = EvoMenuDataProvider;