# Como trabalhar em dupla

Repositório oficial: https://github.com/Filipesilva10/resolveti

## Filipe: compartilhar

Envie o link acima e este guia ao colega. No GitHub, abra Settings > Collaborators > Add people, informe o usuário dele e envie o convite. Ele precisa aceitar antes de enviar branches. Sem convite, ele pode fazer um fork e abrir um pull request a partir dele. Nunca compartilhe senha ou token.

Use `projeto-etapas` como versão oficial. `projeto-completo` é uma referência antiga e não deve substituir a versão oficial. Não envie node_modules nem o banco de demonstração. Para começar em outro computador, prefira clonar do GitHub.

## Colega: preparar no próprio computador

Instale Git e Node.js 24.14 ou superior. No terminal do VS Code:

```powershell
git clone https://github.com/Filipesilva10/resolveti.git
cd resolveti
git config user.name "SEU NOME COMPLETO"
git config user.email "SEU EMAIL VINCULADO AO GITHUB"
npm ci
npm test
npm start
```

Substitua os valores de nome e e-mail pela sua identidade real. Abra http://localhost:3001. Senha das contas de demonstração: Demo@123. Use os botões Solicitante e Técnico na tela de login. Ctrl+C encerra o servidor.

## Contribuições que ainda fazem sentido

Atendimento, mensagens e conclusão já estão implementados. Não faça novos commits fingindo que implementou essas funcionalidades. Revise o sistema e produza uma contribuição verificável:

1. Execute os cenários de `docs/VALIDACAO.md` no seu computador. Crie `docs/VALIDACAO-COLEGA.md` com nome, data, ambiente, passos, resultado observado e capturas. Commit sugerido: `test: registra validacao independente dos fluxos de chamados`.
2. Caso encontre um defeito, corrija-o e registre como reproduzir e como verificou. Commit sugerido, apenas se essa correção existir: `fix: corrige <problema encontrado>`.
3. Revise casos de uso e classes com o código aberto; faça correções efetivas e registre sua participação. Commit sugerido: `docs: revisa casos de uso e identifica integrantes`.

Essas são tarefas propostas, não contribuições já realizadas. A participação exigida pelo professor depende de trabalho real, não de um número artificial de commits.

## Criar branch, commit e enviar

```powershell
git switch main
git pull --ff-only origin main
git switch -c test/validacao-colega
# Execute a revisão e escreva docs/VALIDACAO-COLEGA.md.
git status
git diff
git add docs/VALIDACAO-COLEGA.md
git diff --cached
git commit -m "test: registra validacao independente dos fluxos de chamados"
git push -u origin test/validacao-colega
```

Depois, no GitHub: Compare & pull request, destino `main`, descreva o que fez e as evidências. Filipe revisa o diff, confere os resultados e usa Merge pull request. Cada integrante faz seus próprios commits. Se houver conflito, resolva os trechos com cuidado; não use force push como atalho.

Para outra tarefa, volte à main, execute pull e crie uma nova branch. Adicione somente os arquivos que realmente alterou. `git add` prepara, `git commit` registra localmente e `git push` envia ao GitHub.

## Atenção à cópia local de Filipe

A publicação inicial foi feita pelo conector do GitHub, pois o push direto falhou. Em 15/11 a conexão voltou a funcionar e a branch de entrega passou a seguir o histórico remoto. O histórico local anterior foi preservado em `backup/local-antes-sincronizacao`. Não use force push para substituir o histórico remoto. Para outro computador ou uma cópia anterior à sincronização, prefira um clone novo:

```powershell
git clone https://github.com/Filipesilva10/resolveti.git resolveti-oficial
cd resolveti-oficial
npm ci
```

## Mensagem para enviar ao colega

“O ResolveTI está aqui: https://github.com/Filipesilva10/resolveti. Me passe seu usuário do GitHub para eu te adicionar. Leia docs/COLABORACAO.md, clone e execute o sistema. Sua tarefa proposta é validar os fluxos, registrar evidências e corrigir problemas que encontrar numa branch sua. Depois abra um pull request para eu revisar.”
