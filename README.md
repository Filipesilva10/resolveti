# ResolveTI — desenvolvimento por etapas

Sistema de chamados com login, abertura, consulta, filtros, mensagens, atendimento e conclusão. Criado com assistência de IA para revisão e aprendizado de Filipe e sua dupla. A integração da segunda etapa foi realizada em 15/11/2026.

## Executar
Requer Node.js 24.14 ou superior.

```powershell
cd projeto-etapas
npm install
npm start
```

Abra http://localhost:3001. Na tela de login, escolha Solicitante ou Técnico para preencher a conta de demonstração. Contas: `solicitante@resolveti.local` e `tecnico@resolveti.local`, ambas com senha `Demo@123`.
O banco é criado automaticamente em `dados/resolveti.sqlite`. Contas fictícias, uso local. Sessões ficam em memória e encerram ao reiniciar. Pode aparecer aviso experimental do SQLite.

## Situação real
- Implementado: login, logout, abertura, detalhes, consulta por perfil, busca por título/número, filtros combinados, mensagens, início e conclusão de atendimento.
- Busca ignora acentos e maiúsculas; números podem ser digitados como `#001`.
- Somente o técnico responsável pode concluir, com solução obrigatória. Chamados concluídos não recebem mensagens.
- Rascunhos são limpos ao trocar de chamado ou encerrar a sessão.
- Pendente: revisão visual completa no navegador, diagramas finais, PDF e vídeo.
- A versão completa em `../projeto-completo` é referência para estudo. Não copiar parcelas para criar um histórico fictício.

## Divisão proposta
Filipe revisa e explica formulário, validações e abertura. O segundo integrante desenvolve/revisa atendimento e conclusão, com sua própria conta e commits. Nome e divisão final ainda precisam ser confirmados.

## Git
Commits registram alterações reais. Revisar com `git status` e `git diff`, adicionar somente arquivos da tarefa e escrever mensagens semânticas. Não há tarefa automática por hora e não há alteração de datas ou autoria.

Exemplo para uma próxima mudança real:
```powershell
git switch -c feat/detalhes-chamado
# Desenvolver, testar e revisar a funcionalidade.
git add src/app.js public/app.js public/index.html
git commit -m "feat: adiciona consulta dos detalhes do chamado"
git switch main
git merge feat/detalhes-chamado
```

Repositório: https://github.com/Filipesilva10/resolveti

O segundo integrante ainda não foi identificado. PDF e vídeo ainda não produzidos. Consulte `docs/PLANO.md` para acompanhar as próximas etapas.

## Verificação
Execute `npm test`. Os testes cobrem abertura, autorização por perfil, atribuição, mensagens, conclusão, persistência e filtros. As rotas são exercitadas em memória, sem abrir portas; isso não substitui a revisão visual no navegador.

## Fluxo para demonstrar
1. Entrar como solicitante e abrir um chamado.
2. Sair e entrar como técnico, abrir os detalhes e iniciar atendimento.
3. Enviar uma mensagem e registrar uma solução com pelo menos 10 caracteres.
4. Concluir e verificar o status e a solução na consulta do solicitante.
