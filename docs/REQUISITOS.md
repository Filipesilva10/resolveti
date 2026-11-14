# ResolveTI — requisitos e escopo inicial

## Contexto e objetivo
Solicitações dispersas em conversas dificultam acompanhar problemas de TI. O ResolveTI centraliza a abertura, o atendimento e a solução dos chamados. Os atores são Solicitante e Técnico, ambos usuários autenticados.

## Escopo
Inclui login, abertura, consulta, mensagens, início e conclusão. Exclui anexos, notificações externas, cadastro público, recuperação de senha, exclusão e reabertura. Esta implementação é local e usa contas fictícias.

## Requisitos funcionais
| ID | Nome | Descrição |
| --- | --- | --- |
| RF-01 | Autenticar usuário | Validar e-mail e senha e identificar o perfil de uma conta previamente cadastrada. |
| RF-02 | Abrir chamado | Permitir ao solicitante registrar título, descrição, categoria e prioridade. |
| RF-03 | Consultar chamados | Mostrar ao solicitante seus próprios chamados e ao técnico todos os chamados. |
| RF-04 | Filtrar chamados | Buscar por título/número e combinar filtros de situação e prioridade. |
| RF-05 | Iniciar atendimento | Permitir ao técnico assumir um chamado aberto e registrar-se como responsável. |
| RF-06 | Registrar mensagem | Permitir ao solicitante do chamado e aos técnicos registrar mensagens enquanto não concluído. |
| RF-07 | Concluir chamado | Permitir ao técnico responsável registrar solução e data da conclusão. |
| RF-08 | Encerrar sessão | Invalidar a sessão ao sair. |

## Requisitos não funcionais
| ID | Nome | Descrição e verificação |
| --- | --- | --- |
| RNF-01 | Persistência local | Chamados e mensagens devem continuar disponíveis após reiniciar o servidor, usando o mesmo arquivo SQLite. |
| RNF-02 | Proteção de sessão | Usar cookie HttpOnly e SameSite=Strict; invalidar a sessão após logout ou 8 horas. Verificar respostas HTTP. |
| RNF-03 | Armazenamento de senha | Persistir somente hash com sal, nunca senha em texto puro. Verificar o banco. |
| RNF-04 | Adaptação da interface | Permitir preencher os formulários em larguras de 390px e 1366px, sem campos cortados; a tabela pode ter rolagem horizontal. |
| RNF-05 | Execução reproduzível | Permitir executar com Node 24.14+, npm install e npm start seguindo o README. |

## Regras de negócio
| ID | Nome | Descrição |
| --- | --- | --- |
| RN-01 | Campos obrigatórios | Título de 5 a 100 e descrição de 10 a 2000 caracteres, desconsiderando espaços nas extremidades. |
| RN-02 | Valores permitidos | Categorias: Computador, Internet, Impressora, Sistema ou Outro. Prioridades: Baixa, Média ou Alta. |
| RN-03 | Situação inicial | Todo novo chamado deve iniciar como Aberto, vinculado ao solicitante autenticado. |
| RN-04 | Privacidade | Solicitantes só consultam e enviam mensagens em seus próprios chamados. |
| RN-05 | Atribuição | Só técnicos podem assumir um chamado; somente chamados abertos podem ser assumidos. |
| RN-06 | Encerramento | Somente o técnico responsável pode concluir um chamado Em atendimento, com solução de 10 a 2000 caracteres. |
| RN-07 | Mensagens | Conteúdo entre 1 e 1000 caracteres, com autor e data; chamados concluídos não recebem novas mensagens. |

Documento inicial para revisão. O PDF final deverá acrescentar capa, casos de uso detalhados, diagramas formais e URL real do repositório, na ordem exigida pelo professor.
