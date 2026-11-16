# Validação independente — ResolveTI

Copie este modelo para `docs/VALIDACAO-THEO.md` e preencha com os resultados da sua execução. Use chamados e contas fictícias. Em cada cenário, anote **Passou**, **Falhou** ou **Não executado** e descreva o que viu. Inclua o número do chamado quando for útil para reproduzir.

- Nome completo:
- Usuário do GitHub:
- Data da validação:
- Versão do sistema (resultado de `git rev-parse --short HEAD`):
- Sistema operacional, navegador e versão do Node:
- Endereço testado:
- Resultado de `npm test` (quantos passaram e quantos falharam):

| Cenário | Passos para reproduzir | Resultado esperado | Situação e resultado observado |
| --- | --- | --- | --- |
| Abertura | Entrar como solicitante e abrir um chamado de prioridade Alta. | Chamado aparece como Aberto, com número e prioridade. | |
| Privacidade | Sair e entrar com `ana@resolveti.local` e senha `Demo@123`. | O chamado criado pela outra conta fica fora da lista. | |
| Atendimento | Entrar como técnico, localizar o chamado pelo título e pela prioridade, clicar em Iniciar atendimento e enviar uma mensagem. | Chamado Em atendimento, com responsável e mensagem registrada. | |
| Validação da solução | Tentar concluir com texto de menos de 10 caracteres. | A entrada curta é rejeitada, e o chamado continua Em atendimento. | |
| Conclusão | Informar uma solução válida, sair e abrir o chamado como solicitante. | Status Concluído, solução visível e envio de mensagens indisponível. | |
| Persistência local | Parar o servidor com Ctrl+C, executar `npm start` e entrar novamente. | O chamado criado antes do reinício aparece com o status salvo. | |

## Verificação da ação Limpar filtros

Preencha depois de implementar. Informe em cada linha o perfil, os filtros aplicados, a contagem antes e depois do clique e o resultado.

| Cenário | Resultado esperado após limpar | Situação e resultado observado |
| --- | --- | --- |
| Busca, situação e prioridade com resultado | A busca esvazia, os seletores voltam para Todas e a lista volta a mostrar todos os chamados daquele perfil. | |
| Filtros sem resultado | O estado vazio desaparece se o perfil tiver chamados cadastrados. | |
| Tela móvel | O botão permanece visível e clicável. | |

## Evidências e problemas encontrados

Use `docs/imagens/theo/` para capturas opcionais e informe o cenário de cada imagem. Para um defeito, descreva os passos, o resultado esperado e o que ocorreu. Indique por que um cenário ficou sem executar, se houver.
