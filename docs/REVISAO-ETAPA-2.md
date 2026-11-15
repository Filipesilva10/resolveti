# Revisão da integração — 15/11/2026

## Alterações
- Integradas as telas e rotas de detalhes, mensagens, atribuição ao técnico e conclusão.
- Mantida a porta 3001 e o cookie `etapas`, separado da cópia de referência.
- Incluído módulo de filtros testável: título sem distinção de acentos/maiúsculas, número exato com ou sem #, situação e prioridade combinados.
- Corrigido reaproveitamento indevido de rascunhos ao trocar de chamado ou usuário.
- Identificadores fora da faixa segura de inteiros retornam 404.

## Cobertura automatizada
Login e logout; abertura válida/inválida; privacidade entre solicitantes; início uma única vez; impedimento de concluir por outro técnico; conteúdo, autoria e data de mensagens; rejeição de mensagens vazias/longas; solução obrigatória; bloqueio de alterações após conclusão; persistência após reabrir o banco; filtros isolados/combinados e lista vazia.

Os testes de rotas percorrem o Express e o SQLite com transporte em memória. O banco de demonstração não é modificado pelos testes. A revisão visual e a validação no navegador permanecem na etapa 3.
