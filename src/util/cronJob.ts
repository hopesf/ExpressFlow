import cron from 'node-cron';
import { NextFunction, Response, Request } from 'express';
import { Server } from 'socket.io';

interface HelperRequest {
  routerPath: string;
  count: number;
  ready: boolean;
}

const helperRequests: HelperRequest[] = [];

const cronFunc = (req: Request, res: Response, next: NextFunction, io: Server) => {
  const { originalUrl } = req;
  const checkExistIndex = helperRequests.findIndex((item) => item.routerPath === originalUrl);

  if (checkExistIndex === -1) {
    helperRequests.push({ routerPath: originalUrl, count: 1, ready: false });
  } else {
    helperRequests[checkExistIndex].count += 1;
  }

  res.on('finish', async () => {
    if (checkExistIndex !== -1) {
      helperRequests[checkExistIndex].ready = true;
    }
    io.emit('helperRequests', helperRequests);
  });

  next();
};

export const runCronEveryFiveSeconds = (io: Server) => {
  cron.schedule('*/5 * * * * *', () => {
    if (helperRequests.length > 0) {
      const getElement = helperRequests[0];
      if (getElement.ready) {
        helperRequests.shift();
      }
    }
    io.emit('helperRequests', helperRequests);
  });
};

export default cronFunc;
