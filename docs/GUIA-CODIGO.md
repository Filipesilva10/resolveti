# Como entender e apresentar o ResolveTI

## Ordem para estudar

1. `src/modelos.js`: leia as três classes e explique cada regra em português.
2. `src/banco.js`: veja CREATE TABLE, chaves estrangeiras e contas fictícias.
3. `src/app.js`: acompanhe uma rota de cada vez, começando por abrir chamado.
4. `public/app.js`: acompanhe o submit, fetch, resposta e atualização da tela.
5. `public/filtros.js`: entenda filter, normalização de acentos e número exato.
6. `test/sistema.test.js`: veja exemplos válidos e inválidos das regras.

## Exemplo: abrir um chamado

O navegador intercepta o submit de form-chamado e monta um objeto com FormData. `api` envia JSON com POST /api/chamados. O servidor identifica a sessão, proíbe abertura por técnico, chama Chamado.validar e executa INSERT com parâmetros. O banco gera o ID; a API retorna 201; a interface abre os detalhes desse ID.

## Conceitos para explicar

- Classe: agrupa dados e comportamentos. `Usuario.ehTecnico()` interpreta o perfil; `Chamado.concluir()` concentra a autorização e a regra de solução obrigatória.
- Objeto: uma instância construída com dados do banco. Object.assign copia os campos para a instância.
- Encapsulamento: regras ficam nos métodos, mas os atributos desta implementação JavaScript são públicos; não afirmar que são privados.
- Persistência: SQLite grava em arquivo. Arrays da interface e sessões em Map existem apenas em memória.
- Autenticação: descobrir quem é o usuário por e-mail/senha. Autorização: verificar o que ele pode fazer.
- Hash: transformação não reversível usada para verificar senha. Sal: valor aleatório diferente por conta. Não é criptografia reversível.
- SQL parametrizado: valores vão separados do SQL por `?`; não montar SQL concatenando texto do usuário.
- async/await: permite aguardar fetch sem bloquear a interface. Falhas são mostradas por `executar`/`avisar`.
- Filtro: muda a lista mostrada, não apaga registros do banco. Indicadores mostram totais do perfil, não do filtro.
- textContent: exibe texto de usuário sem interpretá-lo como HTML.
- GET consulta; POST envia ações. 201 indica criação; 401 exige login; 403 nega ação; 404 não revela chamado inacessível.
- Git: commit registra mudança local; push publica; branch separa tarefa; pull request permite revisar antes de integrar.

## Limitações que devem ser conhecidas

Não há anexos, reabertura, cadastro de usuários na tela ou notificações. As sessões desaparecem ao reiniciar. Os dados permanecem. A aplicação é local, com contas fictícias. JavaScript no navegador e Node.js no servidor usam a mesma linguagem, mas executam em ambientes diferentes. O código foi preparado com assistência de IA e precisa ser estudado pelos integrantes.

## Exercício da dupla

Cada integrante deve abrir um chamado e acompanhar no código toda a execução; explicar por que um solicitante não vê os chamados de Ana; demonstrar uma conclusão inválida e uma válida; fazer uma alteração pequena que compreenda, testar e registrar o próprio commit.
