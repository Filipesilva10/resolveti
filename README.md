# ResolveTI - central de chamados

Sistema de chamados com login, abertura, consulta, filtros, mensagens, atendimento e conclusão. Criado com assistência de IA para revisão e aprendizado de Filipe e sua dupla. A integração da segunda etapa foi realizada em 15/11/2026.

[Abrir demonstração pública do ResolveTI](https://resolveti-unifran.onrender.com). A primeira abertura pode demorar se o serviço estiver em repouso. Use os botões **Solicitante** e **Técnico** e preencha os chamados com dados fictícios.

## Executar no computador
Requer Node.js 24.14 ou superior.

```powershell
git clone https://github.com/Filipesilva10/resolveti.git
cd resolveti
npm ci
npm start
```

Abra http://localhost:3001. Na tela de login, escolha Solicitante ou Técnico para preencher a conta de demonstração. Contas: `solicitante@resolveti.local` e `tecnico@resolveti.local`, ambas com senha `Demo@123`.
O banco é criado automaticamente em `dados/resolveti.sqlite`. As sessões encerram ao reiniciar. Pode aparecer aviso experimental do SQLite.

## Modo de demonstração hospedada

Use Node.js 24.14 ou superior, comando de instalação `npm ci` e comando de início `npm start`. Defina `RESOLVETI_DEMO=1` no serviço web. A aplicação escuta em `0.0.0.0` na porta indicada por `PORT`, e a hospedagem deve fornecer HTTPS por um proxy. O SQLite da demonstração fica em memória e começa novo a cada reinício. Visitantes usando a mesma conta fictícia compartilham os chamados. Use somente informações inventadas.

## Situação real
- Implementado: login, logout, abertura, detalhes, consulta por perfil, busca por título/número, filtros combinados, mensagens, início e conclusão de atendimento.
- Busca ignora acentos e maiúsculas; números podem ser digitados como `#001`.
- Somente o técnico responsável pode concluir, com solução obrigatória. Chamados concluídos não recebem mensagens.
- Rascunhos são limpos ao trocar de chamado ou encerrar a sessão.
- Conferido no navegador: abertura, consulta, filtros, atendimento, mensagem e conclusão; formulário móvel em 390px e tela desktop em 1366px.
- PDF com diagramas e vídeo MP4 disponíveis em `entrega/`.
- Pendente para entrega em dupla: identificar o colega e incorporar sua contribuição real com commits próprios.
- A versão completa em `../projeto-completo` é referência para estudo. Não copiar parcelas para criar um histórico fictício.

## Divisão proposta
**Filipe Silva Rodrigues e Theo.** A contribuição proposta para Theo é validar os fluxos e implementar a ação **Limpar filtros**, usando a própria conta e seus commits. Veja [o plano com os arquivos e comandos](docs/PLANO-THEO.md).

## Arquivos de entrega

- [Documentação em PDF](entrega/ResolveTI-documentacao.pdf)
- [Demonstração em MP4](entrega/ResolveTI-demonstracao.mp4)
- [Repositório público](https://github.com/Filipesilva10/resolveti)

Esses são os três itens da entrega pela BB. O vídeo tem cerca de 36 segundos. Para entregar em dupla, complete o nome do Theo na capa e confira que os commits dele aparecem no histórico da `main`. Prazo informado no enunciado: 18/11/2026, às 21h00.

## Materiais de apoio

- [Documentação editável](docs/DOCUMENTACAO.md)
- [Plano do Theo](docs/PLANO-THEO.md) e [modelo de validação](docs/modelos/VALIDACAO-THEO.md)
- [Guia de colaboração](docs/COLABORACAO.md)
- [Validação e roteiro de testes](docs/VALIDACAO.md)
- [Como explicar o código](docs/GUIA-CODIGO.md)

Para regenerar o PDF, execute `python -m pip install reportlab`, depois `python scripts/gerar_documentacao.py`. Defina `RESOLVETI_INTEGRANTE_2` com o nome do colega para preencher a capa. Quando houver um endereço confirmado para a demonstração, defina `RESOLVETI_SITE_URL` com esse endereço para incluí-lo no PDF. O script também gera Markdown e diagramas SVG. A aplicação não depende de Python.

## Verificação
Execute `npm test`. Os testes cobrem abertura, autorização por perfil, atribuição, mensagens, conclusão, persistência e filtros. As rotas são exercitadas em memória, sem abrir portas; isso não substitui a revisão visual no navegador.

## Fluxo para demonstrar
1. Entrar como solicitante e abrir um chamado.
2. Sair e entrar como técnico, abrir os detalhes e iniciar atendimento.
3. Enviar uma mensagem e registrar uma solução com pelo menos 10 caracteres.
4. Concluir e verificar o status e a solução na consulta do solicitante.
