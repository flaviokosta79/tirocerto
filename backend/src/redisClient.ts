import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Configuração avançada de reconexão
const RECONNECT_TIMEOUT = 5000; // 5 segundos
const MAX_RECONNECT_ATTEMPTS = 5;

// Cache em memória como fallback quando o Redis não está disponível
const memoryCache: Record<string, { value: string; expiry: number }> = {};

class RedisClient {
  private client: ReturnType<typeof createClient>;
  private reconnectAttempts = 0;
  private isExplicitDisconnect = false;
  private useMemoryCache = false;

  constructor() {
    // Construa a URL do Redis com base nas variáveis de ambiente
    let redisUrl = 'redis://';
    
    // Adiciona usuário e senha se fornecidos
    if (process.env.REDIS_USER) {
      redisUrl += process.env.REDIS_USER;
      if (process.env.REDIS_PASSWORD) {
        redisUrl += `:${process.env.REDIS_PASSWORD}`;
      }
      redisUrl += '@';
    }
    
    // Adiciona host e porta
    redisUrl += `${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;
    
    console.log(`Tentando conectar ao Redis em: ${redisUrl.replace(/:[^:]*@/, ':***@')}`);
    
    this.client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (attempts) => {
          if (attempts > MAX_RECONNECT_ATTEMPTS) {
            this.useMemoryCache = true;
            console.log('⚠️ Redis: Máximo de tentativas excedido, usando cache em memória');
            return false;
          }
          return Math.min(attempts * 1000, RECONNECT_TIMEOUT);
        }
      }
    });

    this.setupEventHandlers();
    this.connect();
  }

  private setupEventHandlers() {
    this.client.on('connect', () => {
      console.log('🔌 Redis: Connecting...');
      this.reconnectAttempts = 0;
    });

    this.client.on('ready', () => {
      console.log('✅ Redis: Ready');
      this.reconnectAttempts = 0;
      this.useMemoryCache = false;
    });

    this.client.on('reconnecting', () => {
      this.reconnectAttempts++;
      console.log(`🔁 Redis: Reconnecting (attempt ${this.reconnectAttempts})`);
    });

    this.client.on('error', (err) => {
      console.error(`❌ Redis error: ${err.message}`);
      if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        this.useMemoryCache = true;
        console.log('⚠️ Redis: Usando cache em memória como fallback');
      }
    });

    this.client.on('end', () => {
      if (!this.isExplicitDisconnect) {
        console.log('🚨 Redis: Connection closed unexpectedly');
        this.useMemoryCache = true;
        console.log('⚠️ Redis: Usando cache em memória como fallback');
      }
    });
  }

  public async connect() {
    try {
      await this.client.connect();
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
      this.useMemoryCache = true;
      console.log('⚠️ Redis: Usando cache em memória como fallback');
    }
  }

  public async disconnect() {
    this.isExplicitDisconnect = true;
    if (this.isReady) {
      await this.client.quit();
    }
  }

  public getClient() {
    return this.client;
  }

  public get isReady() {
    return this.client.isReady;
  }

  // Método para limpar entradas expiradas do cache em memória
  private cleanMemoryCache() {
    const now = Date.now();
    Object.keys(memoryCache).forEach(key => {
      if (memoryCache[key].expiry < now) {
        delete memoryCache[key];
      }
    });
  }

  // Método seguro para operações no Redis
  public async execute<T>(fn: (client: typeof this.client) => Promise<T>): Promise<T | null> {
    // Se estamos usando cache em memória, tratamos operações específicas
    if (this.useMemoryCache) {
      // Extraímos a operação e a chave do cache da função
      const fnString = fn.toString();
      
      // Verifica se é uma operação GET
      if (fnString.includes('.get(')) {
        const matches = fnString.match(/\.get\(['"](.*?)['"]\)/);
        if (matches && matches[1]) {
          const key = matches[1];
          this.cleanMemoryCache(); // Limpa entradas expiradas
          
          if (memoryCache[key] && memoryCache[key].expiry > Date.now()) {
            console.log(`🧠 Memory Cache hit for key: ${key}`);
            return memoryCache[key].value as unknown as T;
          }
          return null;
        }
      }
      
      // Verifica se é uma operação SET
      if (fnString.includes('.set(')) {
        const setMatches = fnString.match(/\.set\(['"](.*?)['"],\s*(.*?),\s*{\s*EX:\s*(\d+)/);
        if (setMatches && setMatches[1] && setMatches[2] && setMatches[3]) {
          const key = setMatches[1];
          const value = eval(setMatches[2]); // Avalia a expressão para obter o valor
          const expSeconds = parseInt(setMatches[3]);
          
          console.log(`🧠 Memory Cache set for key: ${key}`);
          memoryCache[key] = {
            value: value,
            expiry: Date.now() + (expSeconds * 1000)
          };
          return true as unknown as T;
        }
      }
      
      return null;
    }
    
    // Se não estamos usando cache em memória, tentamos usar o Redis
    try {
      if (!this.isReady) await this.connect();
      if (this.isReady) {
        return await fn(this.client);
      } else {
        return null;
      }
    } catch (err) {
      console.error('Redis operation failed:', err);
      return null;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;