import axios from 'axios';

// Verifica se a API Key foi carregada do .env
const apiKey = process.env.API_FUTEBOL_KEY;
if (!apiKey) {
  console.error("Erro: API_FUTEBOL_KEY não encontrada nas variáveis de ambiente.");
  // Em um cenário real, você poderia lançar um erro ou encerrar o processo
  // process.exit(1);
}

const apiFutebol = axios.create({
  baseURL: 'https://api.api-futebol.com.br/v1/',
  headers: {
    'Authorization': `Bearer ${apiKey}` // Monta o header de autenticação
  }
});

// Interceptor para logar requisições (opcional, útil para debug)
apiFutebol.interceptors.request.use(request => {
  console.log(`Starting Request to API Futebol: ${request.method?.toUpperCase()} ${request.baseURL}${request.url}`);
  return request;
});

// Interceptor para logar respostas (opcional, útil para debug)
apiFutebol.interceptors.response.use(response => {
  console.log(`Response from API Futebol: ${response.status} ${response.config.url}`);
  return response;
}, error => {
  console.error(`Error Response from API Futebol: ${error.response?.status} ${error.config?.url}`, error.message);
  // Rejeita a promise para que o erro possa ser tratado onde a chamada foi feita
  return Promise.reject(error);
});


export default apiFutebol;