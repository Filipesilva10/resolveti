# Validação independente — ResolveTI

Preencha depois de executar os cenários. Use chamados e contas fictícias.

- Nome completo:
- Usuário do GitHub:
- Data da validação:
- Versão do sistema (resultado de `git rev-parse --short HEAD`):
- Sistema operacional, navegador e versão do Node:
- Endereço testado:
- Resultado de `npm test`:

| Cenário | Passos para reproduzir | Resultado esperado | Resultado observado |
| --- | --- | --- | --- |
| Abertura | Entrar como solicitante e abrir um chamado de prioridade Alta. | Chamado aparece como Aberto. | |
| Privacidade | Sair e entrar com `ana@resolveti.local` e senha `Demo@123`. | O chamado criado pela outra conta fica fora da lista. | |
| Atendimento | Entrar como técnico, localizar o chamado pelo título e pela prioridade, clicar em Iniciar atendimento e enviar uma mensagem. | Chamado Em atendimento, com responsável e mensagem registrada. | |
| Conclusão | Tentar concluir com texto curto. Depois informar uma solução válida e abrir o chamado pelo perfil solicitante. | A entrada curta é rejeitada. A solução válida fica visível e o envio de mensagens fica indisponível. | |
| Persistência local | Reiniciar o servidor local e entrar novamente. | O chamado criado antes do reinício aparece com o status salvo. | |

## Verificação da ação Limpar filtros

Preencha esta seção depois de implementar a ação, com o perfil usado, os filtros testados e o que a lista mostrou após o clique. Inclua um cenário sem resultados, um com resultados filtrados e a revisão em tela móvel.

## Evidências e problemas encontrados

Anexe os caminhos das capturas opcionais e descreva cada defeito com passos, resultado esperado e resultado observado. Informe também se algum cenário ficou sem executar.
