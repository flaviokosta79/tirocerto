import dotenv from 'dotenv';
dotenv.config(); // Carrega variáveis do .env para process.env

import express, { Request, Response, NextFunction } from 'express';
import './redisClient'; // Importa para inicializar a conexão com Redis
import { cacheMiddleware } from './middleware/cache'; // Importa o middleware de cache
import apiFutebol from './services/apiFutebol'; // Importa o serviço da API Futebol

const app = express();
const port = process.env.PORT || 3001; // Porta para o backend

app.use(express.json()); // Middleware para parsear JSON

// Rota de teste com cache
// O middleware vai verificar o cache antes de executar a função da rota
app.get('/api/health', cacheMiddleware('health'), (req: Request, res: Response) => {
  console.log('Executing /api/health route handler'); // Adiciona log para ver quando a rota é executada
  res.json({ status: 'UP', timestamp: new Date().toISOString() }); // Adiciona timestamp para ver se está vindo do cache ou não
});

// Rota para buscar campeonatos da API externa (com cache)
app.get('/api/campeonatos', cacheMiddleware('campeonatos'), async (req: Request, res: Response) => {
  try {
    console.log('Executing /api/campeonatos route handler (fetching from external API)');
    const response = await apiFutebol.get('/campeonatos');
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching campeonatos from external API:', error.response?.status, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: 'Erro ao buscar campeonatos da API externa.' });
  }
});

// --- Rotas específicas para o Brasileirão (ID 10) ---

const BRASILEIRAO_ID = 10;

// Rota para detalhes do Brasileirão
app.get('/api/brasileirao', cacheMiddleware(`brasileirao:${BRASILEIRAO_ID}`), async (req: Request, res: Response) => {
  try {
    console.log(`Executing /api/brasileirao handler (fetching from external API)`);
    const response = await apiFutebol.get(`/campeonatos/${BRASILEIRAO_ID}`);
    res.json(response.data);
  } catch (error: any) {
    console.error(`Error fetching Brasileirao details:`, error.response?.status, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: 'Erro ao buscar detalhes do Brasileirão.' });
  }
});

// Rota para tabela do Brasileirão
app.get('/api/brasileirao/tabela', cacheMiddleware(`brasileirao-tabela:${BRASILEIRAO_ID}`), async (req: Request, res: Response) => {
  try {
    console.log(`Executing /api/brasileirao/tabela handler (fetching from external API)`);
    const response = await apiFutebol.get(`/campeonatos/${BRASILEIRAO_ID}/tabela`);
    res.json(response.data);
  } catch (error: any) {
    console.error(`Error fetching Brasileirao tabela:`, error.response?.status, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: 'Erro ao buscar tabela do Brasileirão.' });
  }
});

// Rota para lista de rodadas do Brasileirão
app.get('/api/brasileirao/rodadas', cacheMiddleware(`brasileirao-rodadas:${BRASILEIRAO_ID}`), async (req: Request, res: Response) => {
  try {
    console.log(`Executing /api/brasileirao/rodadas handler (fetching from external API)`);
    const response = await apiFutebol.get(`/campeonatos/${BRASILEIRAO_ID}/rodadas`);
    res.json(response.data);
  } catch (error: any) {
    console.error(`Error fetching Brasileirao rodadas:`, error.response?.status, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: 'Erro ao buscar rodadas do Brasileirão.' });
  }
});

// Rota para detalhes de uma rodada específica do Brasileirão
app.get('/api/brasileirao/rodadas/:numero', cacheMiddleware(`brasileirao-rodada:${BRASILEIRAO_ID}`), async (req: Request, res: Response) => {
  const { numero } = req.params;
  // Validação básica do número da rodada
  if (!numero || isNaN(parseInt(numero))) {
     res.status(400).json({ message: 'Número da rodada inválido.' });
     return; // Encerra a execução aqui
  }
  // Modifica a chave do cache para incluir o número da rodada
  res.locals.cacheKey = `brasileirao-rodada:${BRASILEIRAO_ID}:${numero}`; // O middleware usará esta chave se definida

  try {
    console.log(`Executing /api/brasileirao/rodadas/${numero} handler (fetching from external API)`);
    const response = await apiFutebol.get(`/campeonatos/${BRASILEIRAO_ID}/rodadas/${numero}`);
    res.json(response.data);
  } catch (error: any) {
    console.error(`Error fetching Brasileirao rodada ${numero}:`, error.response?.status, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: `Erro ao buscar rodada ${numero} do Brasileirão.` });
  }
});


app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});