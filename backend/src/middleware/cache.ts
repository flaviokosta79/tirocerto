import { Request, Response, NextFunction, RequestHandler } from 'express';
import redisClient from '../redisClient';

const DEFAULT_EXPIRATION = 300; // 5 minutos em segundos

export const cacheMiddleware = (cacheKey: string): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Tenta obter dados do cache
      const cachedData = await redisClient.execute(async (client) => {
        return await client.get(cacheKey);
      });

      if (cachedData) {
        console.log(`Cache hit for key: ${cacheKey}`);
        res.json(JSON.parse(cachedData));
        return;
      }

      // Intercepta a função res.json para armazenar no cache
      const originalJson = res.json;
      res.json = (body) => {
        // Armazena no cache de forma assíncrona sem bloquear a resposta
        if (res.statusCode === 200) {
          redisClient.execute(async (client) => {
            await client.set(cacheKey, JSON.stringify(body), { EX: DEFAULT_EXPIRATION });
          }).catch((err: Error) => console.error('Failed to set cache:', err));
        }
        return originalJson.call(res, body);
      };

      next();
    } catch (err) {
      console.error('Cache middleware error:', err);
      next();
    }
  };
};

export const sendWithCache = (cacheKey: string, expiration = DEFAULT_EXPIRATION): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cachedData = await redisClient.execute(async (client) => {
        return await client.get(cacheKey);
      });

      if (cachedData) {
        console.log(`Cache hit for key: ${cacheKey}`);
        res.send(cachedData);
        return;
      }

      const originalSend = res.send;
      res.send = (body) => {
        if (res.statusCode === 200 && body) {
          redisClient.execute(async (client) => {
            await client.set(cacheKey, body, { EX: expiration });
          }).catch((err: Error) => console.error('Failed to set cache (send):', err));
        }
        return originalSend.call(res, body);
      };

      next();
    } catch (err) {
      console.error('Send with cache error:', err);
      next();
    }
  };
};