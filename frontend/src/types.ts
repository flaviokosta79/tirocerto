// Define a estrutura esperada para um objeto Campeonato vindo da API
export interface EdicaoAtual {
  edicao_id: number;
  temporada: string;
  nome: string;
  nome_popular: string;
  slug: string;
}

export interface FaseAtual {
  fase_id: number;
  nome: string;
  slug: string;
  tipo: string;
  _link: string;
}

export interface Campeonato {
  campeonato_id: number;
  nome: string;
  slug: string;
  nome_popular: string;
  edicao_atual: EdicaoAtual;
  fase_atual: FaseAtual;
  rodada_atual: number | null; // Pode ser null se não aplicável
  status: string;
  tipo: string;
  logo: string;
  regiao: string;
  _link: string;
}

// Poderíamos adicionar mais interfaces para outras respostas da API aqui

// --- Tipos para a Tabela de Classificação ---
export interface TimeInfo {
  time_id: number;
  nome_popular: string;
  sigla: string;
  escudo: string;
}

export interface TabelaEntry {
  posicao: number;
  pontos: number;
  time: TimeInfo;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  gols_pro: number;
  gols_contra: number;
  saldo_gols: number;
  aproveitamento: number;
  variacao_posicao: number;
  ultimos_jogos: string[]; // Array de 'v', 'e', 'd'
}

export {}; // Garante que o arquivo seja tratado como um módulo