# ResolveTI - documentação consolidada

<b>Central de chamados de suporte técnico</b>

Trabalho Prático - Documentação e Implementação Inicial de um Projeto de Software

UNIFRAN · Ciência da Computação<br/>Análise e Projeto de Sistemas<br/>Professor: Euller

<b>Integrante identificado:</b> Filipe Silva Rodrigues

<b>Participação em dupla:</b> nome do segundo integrante ainda não informado. Confirmar identificação e contribuição efetiva antes da submissão. Este documento não atribui trabalho a uma pessoa não identificada.

Versão de entrega preparada em 15/11/2026 · Franca/SP

Repositório público:<br/><link href="https://github.com/Filipesilva10/resolveti" color="#156d59">https://github.com/Filipesilva10/resolveti</link>

Sistema implementado com assistência de IA, sujeito à revisão e compreensão dos integrantes. Contas e chamados de demonstração são fictícios.


## 1. Contexto, objetivo e escopo


Problemas de TI recebidos por conversas avulsas dificultam descobrir quem solicitou ajuda, quem assumiu o atendimento e qual solução foi aplicada. O ResolveTI organiza esse ciclo em um registro único, com situação, responsável e histórico de mensagens.

<b>Objetivo:</b> permitir que um solicitante abra e acompanhe chamados e que um técnico organize a fila, assuma atendimentos e registre a solução. O escopo prioriza um sistema pequeno, funcional e explicável no segundo ano de Ciência da Computação.

| Ator | Responsabilidades |
| --- | --- |

| Solicitante | Autenticar-se; abrir chamados; consultar e filtrar seus próprios chamados; enviar mensagens enquanto não concluídos; consultar a solução. |

| Técnico | Autenticar-se; consultar todos os chamados; filtrar; iniciar atendimento; enviar mensagens; concluir somente os chamados sob sua responsabilidade. |

<b>Incluído:</b> login/logout, criação, consulta, filtros, mensagens, atribuição, conclusão e armazenamento SQLite local. O painel apresenta totais dos chamados visíveis ao perfil. Os totais não mudam com o filtro da tabela.

<b>Fora do escopo:</b> cadastro público, recuperação de senha, anexos, e-mail, SLA, exclusão/reabertura pela interface, múltiplas organizações, aplicativo nativo e implantação pública.

<b>Premissas:</b> uso acadêmico local, contas previamente cadastradas, navegador moderno e Node.js 24.14 ou superior. Não houve entrevista formal com usuários; os requisitos foram elaborados a partir do problema proposto e validados contra a implementação.

<b>Organização do documento:</b> requisitos e regras; casos de uso; classes de análise e projeto; persistência; arquitetura; validação; execução e entrega.


## 2. Requisitos funcionais


| ID | Requisito e critério de aceitação |
| --- | --- |

| RF-01 | Autenticar: e-mail/senha corretos retornam o perfil; credenciais inválidas são rejeitadas. |

| RF-02 | Abrir: solicitante informa título, descrição, categoria e prioridade; recebe um identificador e status Aberto. |

| RF-03 | Consultar: solicitante vê somente seus chamados; técnico vê todos. Detalhes incluem responsável, mensagens, datas e solução. |

| RF-04 | Filtrar: combinar título/número, situação e prioridade. Busca por título ignora acentos e caixa; número é exato e aceita #001. |

| RF-05 | Iniciar: técnico assume chamado Aberto; passa a responsável e muda status para Em atendimento. |

| RF-06 | Mensagem: solicitante autor ou qualquer técnico registra conteúdo, autor e data, enquanto o chamado não está concluído. |

| RF-07 | Concluir: somente técnico responsável registra solução e data final em chamado Em atendimento. |

| RF-08 | Sair: invalidar sessão no servidor, limpar cookie e retornar ao login. |

<b>Prioridade:</b> todos os requisitos acima pertencem ao núcleo implementado. Melhorias fora do escopo poderão ser planejadas depois da entrega.


## 3. Qualidade e regras de negócio


| ID | Requisito não funcional / verificação |
| --- | --- |

| RNF-01 | Persistência: reabrir o mesmo arquivo SQLite preserva chamados e mensagens; coberto por teste. |

| RNF-02 | Sessão: cookie HttpOnly, SameSite=Strict; validade de 8 horas e invalidação no logout. Reiniciar o servidor encerra sessões. |

| RNF-03 | Senhas: armazenar hash scrypt com sal individual; não guardar senha em texto puro. Contas demo têm credenciais públicas intencionais. |

| RNF-04 | Interface: formulários utilizáveis em 390px e 1366px; tabela pode ter rolagem própria. Conferência visual e medidas no navegador. |

| RNF-05 | Reprodução: instalar dependências pelo lockfile, iniciar e testar com comandos documentados. |

| ID | Regra |
| --- | --- |

| RN-01 | Título: 5 a 100 caracteres; descrição: 10 a 2000. Espaços nas extremidades são removidos. |

| RN-02 | Categorias: Computador, Internet, Impressora, Sistema, Outro. Prioridades: Baixa, Média, Alta. |

| RN-03 | Novo chamado inicia Aberto, vinculado ao solicitante autenticado. |

| RN-04 | Solicitante consulta e envia mensagens somente nos próprios chamados. |

| RN-05 | Somente técnico assume; somente chamado Aberto pode ser assumido. |

| RN-06 | Somente responsável conclui; deve estar Em atendimento; solução tem 10 a 2000 caracteres. |

| RN-07 | Mensagem tem 1 a 1000 caracteres; chamado Concluído não recebe mensagens. |


## 4. Diagrama de casos de uso


A fronteira delimita o sistema. Linhas representam associação entre ator e caso de uso. Autenticação é uma precondição dos casos protegidos; não há uso artificial de include/extend.

![Diagrama de casos de uso](imagens/casos-de-uso.svg)

Consultar / filtrar reúne RF-03 e RF-04. Os demais casos correspondem diretamente a RF-01, RF-02 e RF-05 a RF-08. A autorização por chamado é aplicada no servidor, além da visibilidade dos botões.


## 5. Especificação dos casos de uso


<b>UC-01 Autenticar</b>

<b>Ator:</b> Ambos <b>Precondição:</b> Conta previamente cadastrada.<br/><b>Fluxo principal:</b> Informar e-mail/senha; servidor verifica hash; cria sessão; interface carrega chamados do perfil.<br/><b>Alternativas:</b> Credenciais inválidas: informar erro. Mais de 15 tentativas na janela de um minuto: responder 429.<br/><b>Exceções:</b> falha de rede apresenta erro; sessão expirada exige novo login nos casos protegidos; erro de banco retorna falha sem mensagem de sucesso.<br/><b>Pós-condição:</b> Usuário autenticado por até 8 horas.

<b>UC-02 Abrir chamado</b>

<b>Ator:</b> Solicitante <b>Precondição:</b> Sessão válida.<br/><b>Fluxo principal:</b> Abrir Novo chamado; preencher campos; enviar; servidor valida; insere registro; exibe detalhes.<br/><b>Alternativas:</b> Campo inválido: rejeitar sem inserir. Técnico tentando abrir: negar.<br/><b>Exceções:</b> falha de rede apresenta erro; sessão expirada exige novo login nos casos protegidos; erro de banco retorna falha sem mensagem de sucesso.<br/><b>Pós-condição:</b> Chamado Aberto com solicitante e data de criação.

<b>UC-03 Consultar e filtrar</b>

<b>Ator:</b> Ambos <b>Precondição:</b> Sessão válida.<br/><b>Fluxo principal:</b> Carregar lista permitida; escolher busca/status/prioridade; abrir detalhes de um resultado.<br/><b>Alternativas:</b> Sem resultados: exibir estado vazio. ID inexistente ou não autorizado: 404.<br/><b>Exceções:</b> falha de rede apresenta erro; sessão expirada exige novo login nos casos protegidos; erro de banco retorna falha sem mensagem de sucesso.<br/><b>Pós-condição:</b> Lista/detalhes exibidos; nenhum dado alterado.

<b>UC-04 Iniciar atendimento</b>

<b>Ator:</b> Técnico <b>Precondição:</b> Chamado Aberto.<br/><b>Fluxo principal:</b> Abrir detalhes; acionar Iniciar atendimento; registrar técnico responsável e novo status.<br/><b>Alternativas:</b> Solicitante, chamado já assumido ou concluído: rejeitar.<br/><b>Exceções:</b> falha de rede apresenta erro; sessão expirada exige novo login nos casos protegidos; erro de banco retorna falha sem mensagem de sucesso.<br/><b>Pós-condição:</b> Chamado Em atendimento e responsável definido.


## 6. Casos de uso e estados


<b>UC-05 Registrar mensagem</b>

<b>Ator:</b> Autor do chamado ou técnico <b>Precondição:</b> Sessão válida; chamado não concluído.<br/><b>Fluxo principal:</b> Preencher texto; enviar; validar acesso/conteúdo; salvar autor e data; atualizar conversa.<br/><b>Alternativas:</b> Conteúdo vazio/maior que 1000 ou chamado concluído: rejeitar. Acesso de outro solicitante: 404.<br/><b>Exceções:</b> sessão expirada exige novo login; falha de rede apresenta erro; falha de persistência não informa sucesso.<br/><b>Pós-condição:</b> Mensagem persistida e visível na conversa.

<b>UC-06 Concluir chamado</b>

<b>Ator:</b> Técnico responsável <b>Precondição:</b> Chamado Em atendimento atribuído ao usuário.<br/><b>Fluxo principal:</b> Preencher solução; concluir; validar responsável e conteúdo; salvar status, solução e data final.<br/><b>Alternativas:</b> Outro técnico, solicitante, status incorreto ou solução fora de 10-2000 caracteres: rejeitar.<br/><b>Exceções:</b> sessão expirada exige novo login; falha de rede apresenta erro; falha de persistência não informa sucesso.<br/><b>Pós-condição:</b> Chamado Concluído; solução visível; novas mensagens bloqueadas.

<b>UC-07 Encerrar sessão</b>

<b>Ator:</b> Ambos <b>Precondição:</b> Sessão válida.<br/><b>Fluxo principal:</b> Acionar Sair; excluir token do mapa de sessões; limpar cookie e formulários; mostrar login.<br/><b>Alternativas:</b> Sessão expirada: mostrar login. Falha de rede: apresentar erro.<br/><b>Exceções:</b> sessão expirada exige novo login; falha de rede apresenta erro; falha de persistência não informa sucesso.<br/><b>Pós-condição:</b> Token anterior deixa de autorizar requisições.

| Estado de origem | Ação | Estado de destino |
| --- | --- | --- |

| Criação | Solicitante abre | Aberto |

| Aberto | Técnico assume | Em atendimento |

| Em atendimento | Responsável registra solução | Concluído |

Não há transições de retorno, reabertura ou transferência de responsável nesta versão. Registrar mensagem não altera o estado.


## 7. Classes de análise e projeto


<b>Análise:</b> Usuario representa o participante; Chamado representa a solicitação e seu ciclo; Mensagem representa o conteúdo de uma interação. Interfaces de login/lista/formulário/detalhes são fronteiras; rotas HTTP coordenam as ações; SQLite armazena as entidades.

![Diagrama de classes de projeto](imagens/classes.svg)

Diagrama de projeto: classes exportadas por src/modelos.js. “+” indica membro público; validar é estático. Perfis são valores de Usuario, não subclasses. Um usuário abre zero ou muitos chamados; cada chamado tem um solicitante. Um técnico atende zero ou muitos chamados; cada chamado tem zero ou um técnico.

Mensagem valida conteúdo; ID, autor e chamado são persistidos pela rota. Os relacionamentos mostrados são associações, resolvidas por IDs/SQL; não há herança ou composição de objetos. Parâmetros object são registros com os atributos indicados; validar retorna título, descrição, categoria e prioridade validados. Construtores criam a própria instância, sem tipo de retorno em UML.


## 8. Repositório


<link href="https://github.com/Filipesilva10/resolveti" color="#156d59">https://github.com/Filipesilva10/resolveti</link>

Repositório público, acessível ao professor EullerF. Contém código, testes, documentação editável, diagramas, PDF e vídeo de demonstração. Os commits registram evolução real, sem alterar datas ou atribuir trabalho a outro integrante.

As seções anteriores seguem a ordem exigida: capa, descrição, requisitos, casos de uso, classes e repositório. Os apêndices detalham banco, arquitetura, validação e execução.

<b>Dupla:</b> o enunciado exige commits de ambos os integrantes e rejeita entregas com participação de apenas um no histórico. Nome e contribuição do segundo integrante ainda precisam ser concluídos. O guia docs/COLABORACAO.md orienta clone, revisão independente, branch, commit, push e pull request.

<b>Processo:</b> implementação inicial publicada em 14/11/2026; integração de atendimento, mensagens, filtros e conclusão em 15/11/2026; revisão visual, correção móvel e preparação dos entregáveis em 15/11/2026. Não se afirma que tarefas assistidas foram feitas manualmente pelos integrantes.


## Apêndice A. Modelo de dados


| Tabela | Campos e restrições |
| --- | --- |

| usuarios | id INTEGER PK; nome TEXT obrigatório; email TEXT obrigatório e UNIQUE; senha TEXT obrigatório (sal:hash); perfil TEXT com CHECK solicitante/tecnico. |

| chamados | id INTEGER PK; titulo, descricao, categoria, prioridade TEXT obrigatórios; status TEXT obrigatório com DEFAULT Aberto e CHECK dos três estados; solicitante_id FK obrigatório; tecnico_id FK opcional; solucao TEXT opcional; criado_em TEXT obrigatório; concluido_em TEXT opcional. |

| mensagens | id INTEGER PK; chamado_id FK obrigatório com ON DELETE CASCADE; autor_id FK obrigatório; conteudo TEXT obrigatório; criado_em TEXT obrigatório. |

<b>Cardinalidades persistidas:</b> Usuario 1 para 0..* Chamado como solicitante; Usuario 0..1 para 0..* Chamado como técnico; Chamado 1 para 0..* Mensagem; Usuario 1 para 0..* Mensagem como autor. Cada mensagem tem exatamente um chamado e um autor.

As chaves estrangeiras ficam ativas com PRAGMA foreign_keys = ON. IDs são gerados pelo SQLite. Datas são strings ISO 8601 UTC e formatadas para pt-BR na interface. Categorias, prioridades, comprimentos e transições são validados no domínio/rotas; não há CHECK de todas essas regras no banco.

O arquivo padrão é dados/resolveti.sqlite. O diretório e as três contas de demonstração são criados no primeiro uso. Não são inseridos chamados automaticamente. O banco local não é versionado. A exclusão em cascata é uma regra estrutural; não existe rota de exclusão na aplicação.

<b>Rastreabilidade:</b> RF-01/RF-08 usam usuarios e o mapa de sessões; RF-02/RF-03/RF-04/RF-05/RF-07 usam chamados; RF-06 usa mensagens e usuarios. RN-01/RN-02/RN-05/RN-06/RN-07 aparecem em modelos.js; RN-03/RN-04 são aplicadas pelas rotas e consultas.


## Apêndice B. Arquitetura e implementação


| Camada / arquivo | Papel |
| --- | --- |

| public/index.html e style.css | Estrutura das telas, formulários e aparência responsiva. |

| public/app.js e filtros.js | Eventos, fetch, montagem segura do DOM com textContent, busca e filtros em memória. |

| src/server.js | Abre banco e servidor HTTP em 127.0.0.1:3001. |

| src/app.js | Rotas Express, sessão, autorização, validação de entrada e comandos SQL parametrizados. |

| src/modelos.js | Usuario, Chamado e Mensagem: regras de domínio simples. |

| src/banco.js | Schema, contas demo, hash de senhas e abertura SQLite. |

| test/ | Testes de rotas/domínio, persistência e filtros. |

Fluxo: navegador envia JSON via fetch; Express verifica sessão e perfil, aplica regras, consulta ou altera SQLite e devolve JSON. A interface atualiza o conteúdo. Não há framework de interface, ORM, compilação ou serviço de banco separado.

| Método / rota | Finalidade |
| --- | --- |

| POST /api/login; GET /api/eu; POST /api/sair | Autenticar, recuperar sessão e sair. |

| GET /api/chamados; POST /api/chamados | Listar conforme perfil e criar. |

| GET /api/chamados/:id | Consultar detalhes e mensagens. |

| POST /api/chamados/:id/iniciar | Assumir atendimento. |

| POST /api/chamados/:id/mensagens | Registrar mensagem. |

| POST /api/chamados/:id/concluir | Registrar solução e encerrar. |

Proteções implementadas: senhas com sal/scrypt, cookie HttpOnly/SameSite, JSON obrigatório em alterações, bloqueio de sec-fetch-site cross-site, SQL parametrizado, CSP e textContent. Limitações: sessões e limite de tentativas ficam em memória; não há HTTPS local, recuperação de senha, monitoramento ou validação de carga. Não se apresenta esta versão como pronta para exposição pública.


## Apêndice C. Validação e evidências


<b>Automação:</b> 19 testes aprovados. As requisições passam pelo Express com transporte em memória e bancos temporários; não usam servidor HTTP real. Cobrem criação, validação, privacidade entre solicitantes, atribuição, mensagens, conclusão, persistência e filtros.

<b>Navegador:</b> em 15/11/2026 foram executados login, abertura, busca combinada com prioridade, início, mensagem, solução e consulta pelo solicitante. Após concluir, o formulário de mensagens ficou oculto. Houve correção do transbordamento móvel causado pelo elemento acessível do cabeçalho da tabela; após correção, viewport e largura da página mediram 390px e campos ficaram dentro da tela.

| Área | Evidência / limite |
| --- | --- |

| Filtros | Testes de acento, caixa, número exato e combinação; busca real pela interface. |

| Autorização | Outro solicitante não consulta; outro técnico não conclui chamado alheio; testes automatizados. |

| Persistência | Fechar/reabrir banco temporário preserva informações; teste automatizado. |

| Interface | Revisão de listagem, cadastro e detalhes; desktop e formulário móvel. Sem auditoria completa de acessibilidade. |

| Demonstração | MP4 gravado da aplicação real, com abertura, atendimento, mensagem e conclusão; duração medida no arquivo. |

A validação independente do colega continua proposta em docs/VALIDACAO.md. Não há afirmação de que ele já executou os testes. Melhorias e limitações devem ser descritas conforme observadas, sem alterar os resultados para parecerem aprovados.


## Apêndice D. Execução, Git e entrega


<b>Executar a partir do GitHub:</b><br/>git clone https://github.com/Filipesilva10/resolveti.git<br/>cd resolveti<br/>npm ci<br/>npm test<br/>npm start<br/>Abrir http://localhost:3001

Requer Node.js 24.14+ e Git para clonar. Contas: solicitante@resolveti.local, ana@resolveti.local e tecnico@resolveti.local. Senha: Demo@123. Os botões da tela de login preenchem os dois perfis principais. Ctrl+C encerra o servidor.

<b>Versionamento:</b> repositório público com commits semânticos. Integração de atendimento publicada em 15/11/2026. A publicação inicial usou conector; posteriormente git fetch voltou a funcionar e a branch de entrega passou a seguir o histórico remoto. O histórico local anterior foi preservado em backup. Para colaborar, usar clone do GitHub, branch por tarefa e pull request. Guia completo em docs/COLABORACAO.md.

<b>Divisão:</b> Filipe acompanha a integração e deve compreender abertura, validações e fluxos. Para o colega, propõe-se validação independente, correções encontradas e revisão dos modelos. A divisão é proposta; contribuição, nome e autoria de commits devem refletir o trabalho efetivamente realizado.

<b>Entregáveis:</b> este PDF com link do repositório; entrega/ResolveTI-demonstracao.mp4 (até 1 minuto); repositório público. Prazo informado no enunciado: 18/11/2026 às 21h00. A versão foi preparada em 15/11/2026 para a antecipação solicitada.

<b>Conferência antes de submeter:</b> identificar o segundo integrante se a entrega for em dupla; revisar o PDF; assistir ao MP4; testar o clone; conferir acesso ao repositório; enviar os arquivos no canal definido pelo professor. Preparar arquivos não significa submetê-los ao ambiente acadêmico.

<b>Referências:</b> enunciado “Trabalho Prático - Documentação e Implementação Inicial de um Projeto de Software”, consultado no Notion pelo navegador em 15/11/2026; código e testes deste repositório. O enunciado define envio pela BB, PDF na ordem adotada, vídeo até 1 minuto, commits semânticos e participação de ambos em dupla.

<link href="https://irradiated-worm-914.notion.site/3f9115cb767d800f873de9342b54bcd9" color="#156d59">Enunciado do professor no Notion</link>
