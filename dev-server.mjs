import { createServer } from 'vite';

const server = await createServer({
  root: '/Users/mikep/Downloads/UORLANDO_SCAV_HUNT/universal-hunt',
  server: { host: true, port: 5173 },
});
await server.listen();
server.printUrls();
