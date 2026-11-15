# ResolveTI — contribuição do Theo

Filipe adiciona o usuário do Theo em **Settings → Collaborators → Add people** no [repositório](https://github.com/Filipesilva10/resolveti). Theo aceita o convite, mantém a própria conta conectada ao GitHub e trabalha na branch `feat/theo-validacao-filtros`.

## 1. Testar e registrar

No PowerShell do VS Code, clone o projeto e preencha seu nome e e-mail do GitHub nos dois comandos de configuração.

```powershell
git clone https://github.com/Filipesilva10/resolveti.git
cd resolveti
git config user.name "Seu nome completo"
git config user.email "Seu e-mail vinculado ao GitHub"
git switch -c feat/theo-validacao-filtros
npm ci
npm test
npm start
```

Se já tiver clonado, entre na pasta, rode `git switch main` e `git pull --ff-only` antes de criar a branch. Abra http://localhost:3001 e use os botões **Solicitante** e **Técnico** na tela de entrada. Pode usar outro terminal para fazer os commits enquanto o servidor roda.

Copie [o modelo de validação](modelos/VALIDACAO-THEO.md) para o arquivo que vai subir, execute os cenários e registre os resultados observados. Se anexar uma captura, salve em `docs/imagens/theo/` e inclua o caminho no relatório.

```powershell
Copy-Item docs/modelos/VALIDACAO-THEO.md docs/VALIDACAO-THEO.md
# Preencha docs/VALIDACAO-THEO.md com o resultado da sua execução.
git add docs/VALIDACAO-THEO.md
# Se salvou capturas, adicione também os arquivos específicos que citou.
git diff --cached
git commit -m "test: registra validação independente dos chamados"
git push -u origin feat/theo-validacao-filtros
```

## 2. Implementar a ação Limpar filtros

O painel permite combinar busca, situação e prioridade. A melhoria proposta é adicionar um botão **Limpar filtros** ao lado dos controles. Ao clicar, a busca fica vazia, os dois seletores voltam a **Todos** e a lista e a contagem voltam a mostrar todos os chamados daquele perfil.

| Arquivo | O que alterar |
| --- | --- |
| `public/index.html` | Adicionar um botão do tipo `button` na área dos filtros. |
| `public/app.js` | Fazer o clique limpar `#busca`, `#filtro-status` e `#filtro-prioridade`. Reusar `renderizarLista()` para atualizar a tabela e a contagem. |
| `public/style.css` | Ajustar apenas se o botão precisar de espaço ou alinhamento no celular. |
| `docs/VALIDACAO-THEO.md` | Registrar a verificação da melhoria com resultados populados e com a lista filtrada vazia. |

Crie dois chamados fictícios de prioridades distintas para conferir o antes e o depois. Teste com o perfil solicitante e o técnico, com filtros combinados e em largura móvel. Rode `npm test` e revise o diff. Suba o CSS somente se tiver alterado o arquivo.

```powershell
git add public/index.html public/app.js docs/VALIDACAO-THEO.md
# Se alterou o CSS, rode também: git add public/style.css
git diff --cached
git commit -m "feat: adiciona ação para limpar filtros dos chamados"
git push
```

Abra um pull request para `main` e descreva os testes realizados. Filipe revisa e integra com **Create a merge commit**, para manter os commits originais do Theo no histórico de `main`. O colega pode pedir a revisão assim que concluir e publicar a validação, mesmo se a melhoria do botão ainda estiver em andamento.

O PDF, o vídeo, o ZIP, o banco local e as dependências instaladas ficam fora da contribuição do Theo. Para fechar a capa da entrega em dupla, Filipe usa o nome completo informado pelo Theo.
