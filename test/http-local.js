// Executa o Express sem abrir portas: útil em ambientes que bloqueiam sockets.
// A requisição percorre os middlewares, validações e SQL reais da aplicação.
import { IncomingMessage, ServerResponse } from 'node:http';
import { Duplex } from 'node:stream';

export function requisitar(app, caminho, metodo = 'GET', dados, cookie = '') {
  return new Promise((resolve, reject) => {
    const partes = [];
    const socket = new Duplex({ read() {}, write(chunk, encoding, callback) { partes.push(Buffer.from(chunk)); callback(); } });
    socket.remoteAddress = '127.0.0.1';
    const req = new IncomingMessage(socket);
    req.method = metodo;
    req.url = '/api' + caminho;
    req.httpVersion = '1.1';
    const corpo = metodo === 'GET' ? '' : JSON.stringify(dados || {});
    req.headers = { host: 'localhost', 'content-type': 'application/json', 'content-length': String(Buffer.byteLength(corpo)), cookie };
    const res = new ServerResponse(req);
    res.assignSocket(socket);
    res.on('error', reject);
    res.on('finish', () => {
      try {
        const bruto = Buffer.concat(partes).toString('utf8');
        const inicio = bruto.indexOf('\r\n\r\n');
        const conteudo = bruto.slice(inicio + 4);
        const setCookie = res.getHeader('set-cookie');
        resolve({ status: res.statusCode, cookie: (Array.isArray(setCookie) ? setCookie[0] : setCookie)?.split(';')[0], dados: JSON.parse(conteudo) });
      } catch (erro) { reject(erro); }
      finally { socket.destroy(); }
    });
    if (corpo) req.push(Buffer.from(corpo));
    req.push(null);
    app(req, res);
  });
}
