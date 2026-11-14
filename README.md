# ResolveTI — desenvolvimento por etapas

Primeira etapa funcional: login, abertura com validações, persistência e listagem de chamados. Criada com assistência de IA em 14/11/2026 para revisão e aprendizado de Filipe e sua dupla.

## Executar
Requer Node.js 24.14 ou superior.

```powershell
cd projeto-etapas
npm install
npm start
```

Abra http://localhost:3001. Conta: `solicitante@resolveti.local`, senha `Demo@123`.
O banco é criado automaticamente em `dados/resolveti.sqlite`. Contas fictícias, uso local. Sessões ficam em memória e encerram ao reiniciar. Pode aparecer aviso experimental do SQLite.

## Situação real
- Implementado: login, logout, abertura com validações e consulta por solicitante; técnico pode consultar a lista.
- Pendente: detalhes, filtros, mensagens, início e conclusão de atendimento.
- O documento `docs/REQUISITOS.md` descreve o escopo total planejado, não somente o implementado.
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
