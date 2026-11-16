# ResolveTI — passo a passo para o Theo

## O que você vai encontrar

O ResolveTI é uma central de chamados de TI feita com HTML, CSS e JavaScript no navegador, Node.js com Express no servidor e SQLite para os dados. O solicitante abre e acompanha seus chamados. O técnico filtra a fila, assume o atendimento, responde e registra a solução. O histórico fica no chamado concluído.

Login, abertura, filtros, mensagens e conclusão já funcionam. Também foram revisados a tela móvel, os avisos de conexão, a rolagem da conversa e a navegação por teclado. O projeto tem documentação, um vídeo demonstrativo e uma [demonstração pública](https://resolveti-unifran.onrender.com). Use a cópia local para testar a versão atual do GitHub e conferir persistência.

Sua parte é validar os fluxos e adicionar **Limpar filtros**, em dois commits que mostrem o trabalho que você fizer. Envie ao Filipe seu nome completo para a capa e seu usuário do GitHub para ele convidá-lo em **Settings → Collaborators → Add people**. Aceite o convite e use sua própria conta no [repositório](https://github.com/Filipesilva10/resolveti).

## 1. Testar e registrar

Instale Git e Node.js 24.14 ou superior. No PowerShell do VS Code, clone o projeto e preencha seu nome e e-mail do GitHub nos comandos de configuração.

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

Se já tiver clonado, entre na pasta, rode `git switch main` e `git pull --ff-only` antes de criar a branch. Abra http://localhost:3001. Na entrada, clique em **Solicitante** ou **Técnico** para preencher os dados fictícios e depois clique em **Entrar na central**. A senha de demonstração é `Demo@123`. Use outro terminal para rodar Git e deixe `npm start` rodando no primeiro.

Copie [o modelo de validação](modelos/VALIDACAO-THEO.md) para o arquivo que vai subir, execute os cenários e registre os resultados observados. Se anexar uma captura, salve em `docs/imagens/theo/` e inclua o caminho no relatório.

```powershell
Copy-Item docs/modelos/VALIDACAO-THEO.md docs/VALIDACAO-THEO.md
# Preencha docs/VALIDACAO-THEO.md com o resultado da sua execução.
git add docs/VALIDACAO-THEO.md
git status --short
# Se salvou capturas, adicione os arquivos específicos que citou.
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

Crie dois chamados fictícios com prioridades diferentes. Combine busca, situação e prioridade para obter um resultado. Depois pesquise um título inexistente para obter uma lista vazia. Em ambos os casos, clique em **Limpar filtros** e confira os campos, a lista e a contagem. Repita com o técnico e confira a tela em largura móvel. Limpar filtros deve recuperar os chamados visíveis para aquele perfil. Rode `npm test` e registre o que encontrou no relatório.

```powershell
git add public/index.html public/app.js docs/VALIDACAO-THEO.md
# Se alterou o CSS, rode também: git add public/style.css
git diff --cached
git commit -m "feat: adiciona ação para limpar filtros dos chamados"
git push
```

## 3. Abrir o pull request

Depois do primeiro push, abra o repositório no GitHub e clique em **Compare & pull request**. Se o botão não aparecer, vá em **Pull requests → New pull request**. Escolha `main` como base e `feat/theo-validacao-filtros` como compare. Use o título **Validação independente e ação Limpar filtros**. Descreva o que já testou e o que ainda está em andamento. O segundo push atualiza o mesmo pull request.

Envie o link do pull request e seu nome completo ao Filipe. Ele revisa e integra com **Create a merge commit** para preservar os commits na `main`. Sua branch deve trazer o relatório preenchido, os arquivos que você alterou na melhoria e as capturas que decidiu anexar. Deixe o PDF da disciplina, o vídeo, o ZIP, o banco local e `node_modules` fora do pull request.
