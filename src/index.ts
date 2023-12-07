// Third-party libraries
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import compression from 'compression';
import * as os from 'os-utils';
import helmet from 'helmet';

// Internal modules
import connectDb from './helpers/connectDb.ts';
import swaggerDocs from './util/swagger.ts';
import routes from './routes/index.ts';
import cronFunc, { runCronEveryFiveSeconds } from './util/cronJob.ts';
// Configuration
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// App setup
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cors());
swaggerDocs(app, Number(process.env.PORT));
app.use(limiter);
app.use((req, res, next) => cronFunc(req, res, next, io));
app.use(routes);

// Socket.io logic
let tick = 0;

(async () => {
  await connectDb();

  io.on('connection', async (socket) => {
    setInterval(() => {
      os.cpuUsage((cpuPercent) => {
        socket.emit('cpu', {
          name: (tick += 1),
          value: cpuPercent,
        });
      });
    }, 5000);
  });

  // App listen
  const { PORT, NODE_ENV } = process.env;
  httpServer.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[${NODE_ENV}] Gate açıldı ${PORT}`);
    runCronEveryFiveSeconds(io);
  });
})();

export default app;
