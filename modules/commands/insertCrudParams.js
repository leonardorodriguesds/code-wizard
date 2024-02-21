const vscode = require('vscode');

function insertCrudParams() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('Nenhum editor ativo encontrado.');
        return; // Nenhum editor ativo
    }

    const snippet = new vscode.SnippetString(`const crudParams = {
    retrieve: {
      onReload: new Subject<boolean>(),
      configs: {
        labels: {
          emptyTable: 'Nenhum item cadastrado',
          title: 'Evo Crud',
        },
        layout: {
          showEmptyTable: true,
        },
      },
      table: {
        headers: [
          {
            val: 'Header',
          },
        ],
        dataRows: {
          dynamic: {
            pagedCall: () => of({}),
          },
        },
      },
      actions: {
        topToolbar: [
          {
            type: 'create',
            label: 'Novo',
          },
        ],
        row: [
          {
            type: 'update',
            tooltip: 'Alterar',
          },
          {
            type: 'delete',
          },
        ],
      },
    },    
    create: {
        formParams: this.buildFormParams('create'),
        save: (mapa: Map<string, any>): Observable<boolean> => off({}),
    },
    update: {
      formParams: this.buildFormParams('update'),
      modelBuilder: (id?: string | number): Observable<any> => of({}),
      save: (mapa): Observable<boolean> => off({}),
    },
    delete: {
      executeFunction: (id?: string | number) => {
        if (!id) {
          throw new Error('id nao informado');
        }
        const deleteCommand = (): void => {};
        this.evoModalGenericService.openModalConfirmacaoAntesDeRemover(deleteCommand, 'a operadora de saúde');
      },
    },
  };`);

    editor.insertSnippet(snippet);
}
module.exports = insertCrudParams;

