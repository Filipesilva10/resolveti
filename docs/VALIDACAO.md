# Validação do ResolveTI

Data: 15/11/2026. Ambiente: Windows, Node.js 24.14, Chromium, SQLite local. Execução assistida por IA. Os dados usados são fictícios.

## Testes automatizados

`npm test`: 19 testes aprovados após a preparação do modo de demonstração. Testes exercitam rotas Express em memória, validações, perfis, atribuição, mensagens, conclusão, persistência e filtros.

## Revisão no navegador

| Cenário | Resultado observado |
| --- | --- |
| Login do solicitante e abertura com categoria/prioridade | Chamado Aberto persistido e exibido nos detalhes. |
| Login do técnico e busca por título com prioridade Alta | Lista retornou o chamado esperado. |
| Iniciar atendimento | Técnico vinculado e status Em atendimento. |
| Enviar mensagem | Texto, autor e data aparecem na conversa. |
| Concluir com solução | Status Concluído, solução e data exibidos. |
| Mensagens após conclusão | Formulário oculto; bloqueio da API coberto pelos testes. |
| Voltar ao perfil solicitante | Solução e status final visíveis ao autor. |
| Gravação da demonstração | O fluxo foi executado com cliques e digitação reais no Chromium. O cursor e as legendas foram adicionados à captura para acompanhar as ações. |
| Listagem em viewport móvel de 390px | Identificado transbordamento de elemento acessível no cabeçalho da tabela; corrigido com posicionamento relativo no th. |

## Roteiro para a validação independente da dupla

Registre o resultado real, não copie automaticamente a coluna acima.

1. Execute `npm ci`, `npm test` e `npm start` num clone limpo.
2. Tente login inválido; depois entre como solicitante.
3. Abra chamado válido; confirme validação de título/descrição curtos.
4. Combine título, prioridade e situação; teste busca sem acento e número com #.
5. Entre como técnico; inicie, envie mensagem e conclua com solução válida.
6. Verifique que não pode concluir antes de assumir, nem registrar solução curta.
7. Entre como solicitante; consulte solução; confirme bloqueio de novas mensagens.
8. Entre como ana@resolveti.local e confira que ela não vê chamados de outro solicitante.
9. Reinicie o servidor e verifique persistência (o login precisa ser refeito).
10. Em larguras de 390px e 1366px, preencha formulários; a tabela pode rolar horizontalmente, a página não deve ficar alargada.

Registre nome, data, navegador, versão do Node, resultados e evidências em arquivo próprio. Testes de carga, publicação pública e auditoria de segurança não fazem parte da validação realizada.
