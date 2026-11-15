"""Gera o documento de entrega. Dependências: reportlab, pypdf, pymupdf.
Execute na raiz: python scripts/gerar_documentacao.py
"""
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Circle, Ellipse, Polygon
from reportlab.graphics import renderSVG

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'entrega'
OUT.mkdir(exist_ok=True)
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyPT', fontName='Helvetica', fontSize=10, leading=15, spaceAfter=9, textColor=colors.HexColor('#263d35')))
styles.add(ParagraphStyle(name='SmallPT', parent=styles['BodyPT'], fontSize=8, leading=11, spaceAfter=3))
styles.add(ParagraphStyle(name='TitlePT', fontSize=30, leading=35, textColor=colors.HexColor('#156d59'), spaceAfter=20))
styles.add(ParagraphStyle(name='HeadPT', fontSize=18, leading=23, textColor=colors.HexColor('#156d59'), spaceAfter=16))
story=[]
source=[]
def p(s,small=False):
    story.append(Paragraph(s,styles['SmallPT' if small else 'BodyPT']))
    source.append(s)
def page(title):
    if story: story.append(PageBreak())
    story.append(Paragraph(title,styles['HeadPT']))
    source.append('\n## '+title+'\n')
def table(headers, rows, widths):
    cells=[[Paragraph(escape(str(x)),styles['SmallPT']) for x in row] for row in [headers]+rows]
    t=Table(cells,colWidths=widths,repeatRows=1,hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e4f1eb')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LINEBELOW',(0,0),(-1,0),.7,colors.HexColor('#156d59')),('LINEBELOW',(0,1),(-1,-1),.3,colors.HexColor('#d9e3de'))]))
    story.append(t);story.append(Spacer(1,12))
    source.append('| '+' | '.join(headers)+' |\n| '+' | '.join(['---']*len(headers))+' |')
    source.extend('| '+' | '.join(str(x) for x in row)+' |' for row in rows)
def txt(d,x,y,s,size=9):d.add(String(x,y,s,fontName='Helvetica',fontSize=size,fillColor=colors.HexColor('#263d35')))
def line(d,x1,y1,x2,y2):d.add(Line(x1,y1,x2,y2,strokeColor=colors.HexColor('#738a80'),strokeWidth=1))
def actor(d,x,y,name):
    d.add(Circle(x,y,8,fillColor=None));line(d,x,y-8,x,y-38);line(d,x-16,y-20,x+16,y-20);line(d,x,y-38,x-15,y-56);line(d,x,y-38,x+15,y-56);txt(d,x-24,y-72,name)
def usecase():
    d=Drawing(480,440);d.add(Rect(105,10,270,415,fillColor=None,strokeColor=colors.HexColor('#156d59')));txt(d,210,410,'ResolveTI',12)
    actor(d,45,260,'Solicitante');actor(d,435,260,'Técnico')
    items=[('Autenticar',375,'both'),('Abrir chamado',327,'s'),('Consultar / filtrar',279,'both'),('Registrar mensagem',231,'both'),('Iniciar atendimento',183,'t'),('Concluir chamado',135,'t'),('Encerrar sessão',87,'both')]
    for label,y,who in items:
        d.add(Ellipse(240,y,100,17,fillColor=colors.HexColor('#f4f8f6'),strokeColor=colors.HexColor('#8ba79a')));txt(d,240-len(label)*2.2,y-3,label)
        if who in ('s','both'):line(d,62,225,140,y)
        if who in ('t','both'):line(d,418,225,340,y)
    return d
def classes():
    d=Drawing(480,445)
    def box(x,y,w,h,name,attrs,methods):
        d.add(Rect(x,y,w,h,fillColor=colors.HexColor('#f5f9f7'),strokeColor=colors.HexColor('#156d59')));txt(d,x+8,y+h-18,name,12);line(d,x,y+h-28,x+w,y+h-28)
        yy=y+h-43
        for a in attrs:txt(d,x+8,yy,a,8);yy-=13
        line(d,x,yy+4,x+w,yy+4);yy-=10
        for m in methods:txt(d,x+8,yy,m,8);yy-=13
    box(5,230,190,195,'Usuario',['+ id: number','+ nome, email: string','+ perfil: string'],['+ constructor(dados: object)','+ ehTecnico(): boolean','+ podeConsultar(c: Chamado): boolean'])
    box(235,155,245,270,'Chamado',['+ id, solicitante_id: number','+ tecnico_id: number | null','+ titulo, descricao: string','+ categoria, prioridade, status: string','+ solucao: string | null','+ criado_em: string','+ concluido_em: string | null','+ solicitante: string','+ tecnico: string | null'],['+ constructor(dados: object)','+ validar(dados: object): object {static}','+ iniciar(usuario: Usuario): void','+ concluir(usuario: Usuario,','    solucao: string): void'])
    box(235,20,245,105,'Mensagem',['+ conteudo: string'],['+ constructor(conteudo: string)'])
    line(d,190,360,235,360);txt(d,195,369,'1',8);txt(d,215,369,'0..*',8);txt(d,195,346,'abre',8)
    line(d,190,285,235,285);txt(d,193,294,'0..1',8);txt(d,215,294,'0..*',8);txt(d,192,271,'atende',8)
    return d

story.append(Spacer(1,55));story.append(Paragraph('ResolveTI',styles['TitlePT']))
p('<b>Central de chamados de suporte técnico</b>')
p('Trabalho Prático - Documentação e Implementação Inicial de um Projeto de Software')
p('UNIFRAN · Ciência da Computação<br/>Análise e Projeto de Sistemas<br/>Professor: Euller')
story.append(Spacer(1,35));p('<b>Integrante identificado:</b> Filipe Silva Rodrigues')
p('<b>Participação em dupla:</b> nome do segundo integrante ainda não informado. Confirmar identificação e contribuição efetiva antes da submissão. Este documento não atribui trabalho a uma pessoa não identificada.')
p('Versão de entrega preparada em 15/11/2026 · Franca/SP')
p('Repositório público:<br/><link href="https://github.com/Filipesilva10/resolveti" color="#156d59">https://github.com/Filipesilva10/resolveti</link>')
p('Sistema implementado com assistência de IA, sujeito à revisão e compreensão dos integrantes. Contas e chamados de demonstração são fictícios.')
page('1. Contexto, objetivo e escopo')
p('Problemas de TI recebidos por conversas avulsas dificultam descobrir quem solicitou ajuda, quem assumiu o atendimento e qual solução foi aplicada. O ResolveTI organiza esse ciclo em um registro único, com situação, responsável e histórico de mensagens.')
p('<b>Objetivo:</b> permitir que um solicitante abra e acompanhe chamados e que um técnico organize a fila, assuma atendimentos e registre a solução. O escopo prioriza um sistema pequeno, funcional e explicável no segundo ano de Ciência da Computação.')
table(['Ator','Responsabilidades'],[['Solicitante','Autenticar-se; abrir chamados; consultar e filtrar seus próprios chamados; enviar mensagens enquanto não concluídos; consultar a solução.'],['Técnico','Autenticar-se; consultar todos os chamados; filtrar; iniciar atendimento; enviar mensagens; concluir somente os chamados sob sua responsabilidade.']],[90,390])
p('<b>Incluído:</b> login/logout, criação, consulta, filtros, mensagens, atribuição, conclusão e armazenamento SQLite local. O painel apresenta totais dos chamados visíveis ao perfil. Os totais não mudam com o filtro da tabela.')
p('<b>Fora do escopo:</b> cadastro público, recuperação de senha, anexos, e-mail, SLA, exclusão/reabertura pela interface, múltiplas organizações, aplicativo nativo e implantação pública.')
p('<b>Premissas:</b> uso acadêmico local, contas previamente cadastradas, navegador moderno e Node.js 24.14 ou superior. Não houve entrevista formal com usuários; os requisitos foram elaborados a partir do problema proposto e validados contra a implementação.')
p('<b>Organização do documento:</b> requisitos e regras; casos de uso; classes de análise e projeto; persistência; arquitetura; validação; execução e entrega.')
page('2. Requisitos funcionais')
table(['ID','Requisito e critério de aceitação'],[
['RF-01','Autenticar: e-mail/senha corretos retornam o perfil; credenciais inválidas são rejeitadas.'],
['RF-02','Abrir: solicitante informa título, descrição, categoria e prioridade; recebe um identificador e status Aberto.'],
['RF-03','Consultar: solicitante vê somente seus chamados; técnico vê todos. Detalhes incluem responsável, mensagens, datas e solução.'],
['RF-04','Filtrar: combinar título/número, situação e prioridade. Busca por título ignora acentos e caixa; número é exato e aceita #001.'],
['RF-05','Iniciar: técnico assume chamado Aberto; passa a responsável e muda status para Em atendimento.'],
['RF-06','Mensagem: solicitante autor ou qualquer técnico registra conteúdo, autor e data, enquanto o chamado não está concluído.'],
['RF-07','Concluir: somente técnico responsável registra solução e data final em chamado Em atendimento.'],
['RF-08','Sair: invalidar sessão no servidor, limpar cookie e retornar ao login.']],[55,425])
p('<b>Prioridade:</b> todos os requisitos acima pertencem ao núcleo implementado. Melhorias fora do escopo poderão ser planejadas depois da entrega.')
page('3. Qualidade e regras de negócio')
table(['ID','Requisito não funcional / verificação'],[
['RNF-01','Persistência: reabrir o mesmo arquivo SQLite preserva chamados e mensagens; coberto por teste.'],
['RNF-02','Sessão: cookie HttpOnly, SameSite=Strict; validade de 8 horas e invalidação no logout. Reiniciar o servidor encerra sessões.'],
['RNF-03','Senhas: armazenar hash scrypt com sal individual; não guardar senha em texto puro. Contas demo têm credenciais públicas intencionais.'],
['RNF-04','Interface: formulários utilizáveis em 390px e 1366px; tabela pode ter rolagem própria. Conferência visual e medidas no navegador.'],
['RNF-05','Reprodução: instalar dependências pelo lockfile, iniciar e testar com comandos documentados.']],[60,420])
table(['ID','Regra'],[
['RN-01','Título: 5 a 100 caracteres; descrição: 10 a 2000. Espaços nas extremidades são removidos.'],
['RN-02','Categorias: Computador, Internet, Impressora, Sistema, Outro. Prioridades: Baixa, Média, Alta.'],
['RN-03','Novo chamado inicia Aberto, vinculado ao solicitante autenticado.'],
['RN-04','Solicitante consulta e envia mensagens somente nos próprios chamados.'],
['RN-05','Somente técnico assume; somente chamado Aberto pode ser assumido.'],
['RN-06','Somente responsável conclui; deve estar Em atendimento; solução tem 10 a 2000 caracteres.'],
['RN-07','Mensagem tem 1 a 1000 caracteres; chamado Concluído não recebe mensagens.']],[60,420])
page('4. Diagrama de casos de uso')
p('A fronteira delimita o sistema. Linhas representam associação entre ator e caso de uso. Autenticação é uma precondição dos casos protegidos; não há uso artificial de include/extend.')
uc=usecase();story.append(uc)
renderSVG.drawToFile(uc,str(ROOT/'docs'/'imagens'/'casos-de-uso.svg'))
source.append('![Diagrama de casos de uso](imagens/casos-de-uso.svg)')
p('Consultar / filtrar reúne RF-03 e RF-04. Os demais casos correspondem diretamente a RF-01, RF-02 e RF-05 a RF-08. A autorização por chamado é aplicada no servidor, além da visibilidade dos botões.',True)
page('5. Especificação dos casos de uso')
for title,actor_,pre,flow,alt,post in [
('UC-01 Autenticar','Ambos','Conta previamente cadastrada.','Informar e-mail/senha; servidor verifica hash; cria sessão; interface carrega chamados do perfil.','Credenciais inválidas: informar erro. Mais de 15 tentativas na janela de um minuto: responder 429.','Usuário autenticado por até 8 horas.'),
('UC-02 Abrir chamado','Solicitante','Sessão válida.','Abrir Novo chamado; preencher campos; enviar; servidor valida; insere registro; exibe detalhes.','Campo inválido: rejeitar sem inserir. Técnico tentando abrir: negar.','Chamado Aberto com solicitante e data de criação.'),
('UC-03 Consultar e filtrar','Ambos','Sessão válida.','Carregar lista permitida; escolher busca/status/prioridade; abrir detalhes de um resultado.','Sem resultados: exibir estado vazio. ID inexistente ou não autorizado: 404.','Lista/detalhes exibidos; nenhum dado alterado.'),
('UC-04 Iniciar atendimento','Técnico','Chamado Aberto.','Abrir detalhes; acionar Iniciar atendimento; registrar técnico responsável e novo status.','Solicitante, chamado já assumido ou concluído: rejeitar.','Chamado Em atendimento e responsável definido.')]:
    p('<b>'+title+'</b>')
    p(f'<b>Ator:</b> {actor_} <b>Precondição:</b> {pre}<br/><b>Fluxo principal:</b> {flow}<br/><b>Alternativas:</b> {alt}<br/><b>Exceções:</b> falha de rede apresenta erro; sessão expirada exige novo login nos casos protegidos; erro de banco retorna falha sem mensagem de sucesso.<br/><b>Pós-condição:</b> {post}',True)
    story.append(Spacer(1,10))
page('6. Casos de uso e estados')
for title,actor_,pre,flow,alt,post in [
('UC-05 Registrar mensagem','Autor do chamado ou técnico','Sessão válida; chamado não concluído.','Preencher texto; enviar; validar acesso/conteúdo; salvar autor e data; atualizar conversa.','Conteúdo vazio/maior que 1000 ou chamado concluído: rejeitar. Acesso de outro solicitante: 404.','Mensagem persistida e visível na conversa.'),
('UC-06 Concluir chamado','Técnico responsável','Chamado Em atendimento atribuído ao usuário.','Preencher solução; concluir; validar responsável e conteúdo; salvar status, solução e data final.','Outro técnico, solicitante, status incorreto ou solução fora de 10-2000 caracteres: rejeitar.','Chamado Concluído; solução visível; novas mensagens bloqueadas.'),
('UC-07 Encerrar sessão','Ambos','Sessão válida.','Acionar Sair; excluir token do mapa de sessões; limpar cookie e formulários; mostrar login.','Sessão expirada: mostrar login. Falha de rede: apresentar erro.','Token anterior deixa de autorizar requisições.')]:
    p('<b>'+title+'</b>');p(f'<b>Ator:</b> {actor_} <b>Precondição:</b> {pre}<br/><b>Fluxo principal:</b> {flow}<br/><b>Alternativas:</b> {alt}<br/><b>Exceções:</b> sessão expirada exige novo login; falha de rede apresenta erro; falha de persistência não informa sucesso.<br/><b>Pós-condição:</b> {post}',True);story.append(Spacer(1,12))
table(['Estado de origem','Ação','Estado de destino'],[['Criação','Solicitante abre','Aberto'],['Aberto','Técnico assume','Em atendimento'],['Em atendimento','Responsável registra solução','Concluído']],[135,210,135])
p('Não há transições de retorno, reabertura ou transferência de responsável nesta versão. Registrar mensagem não altera o estado.')
page('7. Classes de análise e projeto')
p('<b>Análise:</b> Usuario representa o participante; Chamado representa a solicitação e seu ciclo; Mensagem representa o conteúdo de uma interação. Interfaces de login/lista/formulário/detalhes são fronteiras; rotas HTTP coordenam as ações; SQLite armazena as entidades.')
cl=classes();story.append(cl)
renderSVG.drawToFile(cl,str(ROOT/'docs'/'imagens'/'classes.svg'))
source.append('![Diagrama de classes de projeto](imagens/classes.svg)')
p('Diagrama de projeto: classes exportadas por src/modelos.js. “+” indica membro público; validar é estático. Perfis são valores de Usuario, não subclasses. Um usuário abre zero ou muitos chamados; cada chamado tem um solicitante. Um técnico atende zero ou muitos chamados; cada chamado tem zero ou um técnico.',True)
p('Mensagem valida conteúdo; ID, autor e chamado são persistidos pela rota. Os relacionamentos mostrados são associações, resolvidas por IDs/SQL; não há herança ou composição de objetos. Parâmetros object são registros com os atributos indicados; validar retorna título, descrição, categoria e prioridade validados. Construtores criam a própria instância, sem tipo de retorno em UML.',True)
page('8. Repositório')
p('<link href="https://github.com/Filipesilva10/resolveti" color="#156d59">https://github.com/Filipesilva10/resolveti</link>')
p('Repositório público, acessível ao professor EullerF. Contém código, testes, documentação editável, diagramas, PDF e vídeo de demonstração. Os commits registram evolução real, sem alterar datas ou atribuir trabalho a outro integrante.')
p('As seções anteriores seguem a ordem exigida: capa, descrição, requisitos, casos de uso, classes e repositório. Os apêndices detalham banco, arquitetura, validação e execução.')
p('<b>Dupla:</b> o enunciado exige commits de ambos os integrantes e rejeita entregas com participação de apenas um no histórico. Nome e contribuição do segundo integrante ainda precisam ser concluídos. O guia docs/COLABORACAO.md orienta clone, revisão independente, branch, commit, push e pull request.')
p('<b>Processo:</b> implementação inicial publicada em 14/11/2026; integração de atendimento, mensagens, filtros e conclusão em 15/11/2026; revisão visual, correção móvel e preparação dos entregáveis em 15/11/2026. Não se afirma que tarefas assistidas foram feitas manualmente pelos integrantes.')
page('Apêndice A. Modelo de dados')
table(['Tabela','Campos e restrições'],[
['usuarios','id INTEGER PK; nome TEXT obrigatório; email TEXT obrigatório e UNIQUE; senha TEXT obrigatório (sal:hash); perfil TEXT com CHECK solicitante/tecnico.'],
['chamados','id INTEGER PK; titulo, descricao, categoria, prioridade TEXT obrigatórios; status TEXT obrigatório com DEFAULT Aberto e CHECK dos três estados; solicitante_id FK obrigatório; tecnico_id FK opcional; solucao TEXT opcional; criado_em TEXT obrigatório; concluido_em TEXT opcional.'],
['mensagens','id INTEGER PK; chamado_id FK obrigatório com ON DELETE CASCADE; autor_id FK obrigatório; conteudo TEXT obrigatório; criado_em TEXT obrigatório.']],[85,395])
p('<b>Cardinalidades persistidas:</b> Usuario 1 para 0..* Chamado como solicitante; Usuario 0..1 para 0..* Chamado como técnico; Chamado 1 para 0..* Mensagem; Usuario 1 para 0..* Mensagem como autor. Cada mensagem tem exatamente um chamado e um autor.')
p('As chaves estrangeiras ficam ativas com PRAGMA foreign_keys = ON. IDs são gerados pelo SQLite. Datas são strings ISO 8601 UTC e formatadas para pt-BR na interface. Categorias, prioridades, comprimentos e transições são validados no domínio/rotas; não há CHECK de todas essas regras no banco.')
p('O arquivo padrão é dados/resolveti.sqlite. O diretório e as três contas de demonstração são criados no primeiro uso. Não são inseridos chamados automaticamente. O banco local não é versionado. A exclusão em cascata é uma regra estrutural; não existe rota de exclusão na aplicação.')
p('<b>Rastreabilidade:</b> RF-01/RF-08 usam usuarios e o mapa de sessões; RF-02/RF-03/RF-04/RF-05/RF-07 usam chamados; RF-06 usa mensagens e usuarios. RN-01/RN-02/RN-05/RN-06/RN-07 aparecem em modelos.js; RN-03/RN-04 são aplicadas pelas rotas e consultas.')
page('Apêndice B. Arquitetura e implementação')
table(['Camada / arquivo','Papel'],[['public/index.html e style.css','Estrutura das telas, formulários e aparência responsiva.'],['public/app.js e filtros.js','Eventos, fetch, montagem segura do DOM com textContent, busca e filtros em memória.'],['src/server.js','Abre banco e servidor HTTP em 127.0.0.1:3001.'],['src/app.js','Rotas Express, sessão, autorização, validação de entrada e comandos SQL parametrizados.'],['src/modelos.js','Usuario, Chamado e Mensagem: regras de domínio simples.'],['src/banco.js','Schema, contas demo, hash de senhas e abertura SQLite.'],['test/','Testes de rotas/domínio, persistência e filtros.']],[175,305])
p('Fluxo: navegador envia JSON via fetch; Express verifica sessão e perfil, aplica regras, consulta ou altera SQLite e devolve JSON. A interface atualiza o conteúdo. Não há framework de interface, ORM, compilação ou serviço de banco separado.')
table(['Método / rota','Finalidade'],[['POST /api/login; GET /api/eu; POST /api/sair','Autenticar, recuperar sessão e sair.'],['GET /api/chamados; POST /api/chamados','Listar conforme perfil e criar.'],['GET /api/chamados/:id','Consultar detalhes e mensagens.'],['POST /api/chamados/:id/iniciar','Assumir atendimento.'],['POST /api/chamados/:id/mensagens','Registrar mensagem.'],['POST /api/chamados/:id/concluir','Registrar solução e encerrar.']],[260,220])
p('Proteções implementadas: senhas com sal/scrypt, cookie HttpOnly/SameSite, JSON obrigatório em alterações, bloqueio de sec-fetch-site cross-site, SQL parametrizado, CSP e textContent. Limitações: sessões e limite de tentativas ficam em memória; não há HTTPS local, recuperação de senha, monitoramento ou validação de carga. Não se apresenta esta versão como pronta para exposição pública.',True)
page('Apêndice C. Validação e evidências')
p('<b>Automação:</b> 19 testes aprovados. As requisições passam pelo Express com transporte em memória e bancos temporários; não usam servidor HTTP real. Cobrem criação, validação, privacidade entre solicitantes, atribuição, mensagens, conclusão, persistência e filtros.')
p('<b>Navegador:</b> em 15/11/2026 foram executados login, abertura, busca combinada com prioridade, início, mensagem, solução e consulta pelo solicitante. Após concluir, o formulário de mensagens ficou oculto. Houve correção do transbordamento móvel causado pelo elemento acessível do cabeçalho da tabela; após correção, viewport e largura da página mediram 390px e campos ficaram dentro da tela.')
table(['Área','Evidência / limite'],[['Filtros','Testes de acento, caixa, número exato e combinação; busca real pela interface.'],['Autorização','Outro solicitante não consulta; outro técnico não conclui chamado alheio; testes automatizados.'],['Persistência','Fechar/reabrir banco temporário preserva informações; teste automatizado.'],['Interface','Revisão de listagem, cadastro e detalhes; desktop e formulário móvel. Sem auditoria completa de acessibilidade.'],['Demonstração','MP4 gravado da aplicação real, com abertura, atendimento, mensagem e conclusão; duração medida no arquivo.']],[105,375])
p('A validação independente do colega continua proposta em docs/VALIDACAO.md. Não há afirmação de que ele já executou os testes. Melhorias e limitações devem ser descritas conforme observadas, sem alterar os resultados para parecerem aprovados.')
page('Apêndice D. Execução, Git e entrega')
p('<b>Executar a partir do GitHub:</b><br/>git clone https://github.com/Filipesilva10/resolveti.git<br/>cd resolveti<br/>npm ci<br/>npm test<br/>npm start<br/>Abrir http://localhost:3001')
p('Requer Node.js 24.14+ e Git para clonar. Contas: solicitante@resolveti.local, ana@resolveti.local e tecnico@resolveti.local. Senha: Demo@123. Os botões da tela de login preenchem os dois perfis principais. Ctrl+C encerra o servidor.')
p('<b>Versionamento:</b> repositório público com commits semânticos. Integração de atendimento publicada em 15/11/2026. A publicação inicial usou conector; posteriormente git fetch voltou a funcionar e a branch de entrega passou a seguir o histórico remoto. O histórico local anterior foi preservado em backup. Para colaborar, usar clone do GitHub, branch por tarefa e pull request. Guia completo em docs/COLABORACAO.md.')
p('<b>Divisão:</b> Filipe acompanha a integração e deve compreender abertura, validações e fluxos. Para o colega, propõe-se validação independente, correções encontradas e revisão dos modelos. A divisão é proposta; contribuição, nome e autoria de commits devem refletir o trabalho efetivamente realizado.')
p('<b>Entregáveis:</b> este PDF com link do repositório; entrega/ResolveTI-demonstracao.mp4 (até 1 minuto); repositório público. Prazo informado no enunciado: 18/11/2026 às 21h00. A versão foi preparada em 15/11/2026 para a antecipação solicitada.')
p('<b>Conferência antes de submeter:</b> identificar o segundo integrante se a entrega for em dupla; revisar o PDF; assistir ao MP4; testar o clone; conferir acesso ao repositório; enviar os arquivos no canal definido pelo professor. Preparar arquivos não significa submetê-los ao ambiente acadêmico.')
p('<b>Referências:</b> enunciado “Trabalho Prático - Documentação e Implementação Inicial de um Projeto de Software”, consultado no Notion pelo navegador em 15/11/2026; código e testes deste repositório. O enunciado define envio pela BB, PDF na ordem adotada, vídeo até 1 minuto, commits semânticos e participação de ambos em dupla.',True)
p('<link href="https://irradiated-worm-914.notion.site/3f9115cb767d800f873de9342b54bcd9" color="#156d59">Enunciado do professor no Notion</link>',True)

def footer(c,doc):
    c.setStrokeColor(colors.HexColor('#d9e3de'));c.line(48,42,547,42)
    c.setFont('Helvetica',8);c.setFillColor(colors.HexColor('#71817c'));c.drawString(48,29,'ResolveTI | Análise e Projeto de Sistemas | 15/11/2026');c.drawRightString(547,29,str(doc.page))
doc=SimpleDocTemplate(str(OUT/'ResolveTI-documentacao.pdf'),pagesize=(595.28,841.89),rightMargin=55,leftMargin=55,topMargin=48,bottomMargin=58,title='ResolveTI - Documentação do projeto',author='Filipe Silva Rodrigues')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
(ROOT/'docs'/'DOCUMENTACAO.md').write_text('# ResolveTI - documentação consolidada\n\n'+'\n\n'.join(source)+'\n',encoding='utf-8')
print(OUT/'ResolveTI-documentacao.pdf')
