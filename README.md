# Fantasy Game - Campeonato Brasileiro 2025

![Banner do Projeto](frontend/public/logo192.png)

Plataforma interativa de apostas para o Campeonato Brasileiro de Futebol 2025.

## 🚀 Funcionalidades

- ✅ Apostas em resultados de jogos (vitória, empate, derrota)
- ✅ Apostas em placar exato
- ✅ Indicação de jogadores que marcarão gols
- ✅ Sistema de pontuação automatizado
- ✅ Ranking dinâmico de jogadores
- ✅ Painel administrativo para gerenciamento

## ⚙️ Tecnologias

### Frontend
- React.js com TypeScript
- Material-UI para componentes UI
- Axios para requisições HTTP
- React Router para navegação

### Backend
- Node.js com Express
- Redis para cache
- API Futebol (externa)
- PostgreSQL (opcional)

## 🏁 Como Executar

### Pré-requisitos
- Node.js v16+
- npm ou yarn
- Redis (para cache)

### Instalação
1. Clone o repositório:
```bash
git clone https://github.com/flaviokosta79/tirocerto.git
cd tirocerto
```

2. Instale as dependências:
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com:
```
API_FUTEBOL_KEY=sua_chave_aqui
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USER=default
REDIS_PASSWORD=
PORT=3001
```

4. Inicie os serviços:
```bash
# Em um terminal:
cd backend && npm run dev

# Em outro terminal:
cd frontend && npm start
```

## 📂 Estrutura de Pastas

```
tirocerto/
├── backend/         # Código do servidor Node.js
├── frontend/        # Aplicação React
├── api/             # Documentação da API
├── .env             # Variáveis de ambiente
└── README.md        # Este arquivo
```

## 🤝 Contribuição
Contribuições são bem-vindas! Siga os passos:
1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença
Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

## ✉️ Contato
Flavio Costa - [@flaviokosta79](https://github.com/flaviokosta79)