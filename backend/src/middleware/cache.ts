import { Request, Response, NextFunction, RequestHandler } from 'express';
import redisClient from '../redisClient';

const DEFAULT_EXPIRATION = 300; // 5 minutos em segundos

export const cacheMiddleware = (cacheKey: string): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Primeiro verifica o cache
      const cachedData = await redisClient.execute(async (client) => {
        return await client.get(cacheKey);
      });

      if (cachedData) {
        console.log(`Cache hit for key: ${cacheKey}`);
        res.json(JSON.parse(cachedData));
        return;
      }

      // 2. Se não tiver cache, continua para a rota
      const originalJson = res.json;
      res.json = (body) => {
        // 3. Armazena no cache apenas se a requisição for bem sucedida
        if (res.statusCode === 200) {
          redisClient.execute(async (client) => {
            // 4. Usa EX para expiração e NX para não sobrescrever cache existente
            await client.set(cacheKey, JSON.stringify(body), { 
              EX: DEFAULT_EXPIRATION,
              NX: true
            });
            console.log(`Cache set for key: ${cacheKey}`);
          }).catch((err) => console.error('Cache set error:', err));
        }
        return originalJson.call(res, body);
      };

      next();
    } catch (err) {
      console.error('Cache middleware error:', err);
      next(err);
    }
  };
};