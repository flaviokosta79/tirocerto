import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  CircularProgress, 
  Alert,
  Divider,
  Avatar,
  Container
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import StadiumIcon from '@mui/icons-material/Stadium';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Interface para os dados de partida
interface Time {
  time_id: number;
  nome_popular: string;
  sigla: string;
  escudo: string;
}

interface Partida {
  partida_id: number;
  time_mandante: Time;
  time_visitante: Time;
  placar_mandante: number | null;
  placar_visitante: number | null;
  data_realizacao: string;
  hora_realizacao: string;
  estadio: {
    nome_popular: string;
  };
  status: string;
}

interface RodadaResponse {
  nome: string;
  slug: string;
  rodada: number;
  status: string;
  proxima_rodada?: {
    nome: string;
    slug: string;
    rodada: number;
    status: string;
  };
  rodada_anterior?: {
    nome: string;
    slug: string;
    rodada: number;
    status: string;
  } | null;
  partidas: Partida[];
}

const JogosRodada: React.FC<{ rodadaNumero?: number }> = ({ rodadaNumero = 1 }) => {
  const [jogos, setJogos] = useState<Partida[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`/api/brasileirao/rodadas/${rodadaNumero}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: Falha ao buscar jogos da rodada`);
        }
        return response.json();
      })
      .then((data: RodadaResponse) => {
        console.log('Dados da rodada:', data);
        
        if (data && Array.isArray(data.partidas)) {
          // Debug: Verificar formato das datas recebidas
          if (data.partidas.length > 0) {
            console.log('Exemplo de data recebida:', {
              data: data.partidas[0].data_realizacao,
              hora: data.partidas[0].hora_realizacao,
              formato: typeof data.partidas[0].data_realizacao
            });
          }
          
          // Mock dados para desenvolvimento se necessário
          const partidasComDataCorrigida = data.partidas.map(partida => ({
            ...partida,
            data_realizacao: partida.data_realizacao || '2025-03-29',
            hora_realizacao: partida.hora_realizacao || '18:30'
          }));
          
          setJogos(partidasComDataCorrigida);
        } else {
          console.error('Formato de dados inesperado:', data);
          setJogos([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching jogos:', err);
        setError(err.message || 'Ocorreu um erro ao buscar os jogos da rodada.');
        setLoading(false);
      });
  }, [rodadaNumero]);

  // Formata a data para exibição no formato "DD/MM • Dia da Semana • HH:MM"
  const formatarData = (dataStr: string, horaStr: string) => {
    try {
      // Formato esperado: "yyyy-MM-dd"
      const [ano, mes, dia] = dataStr.split('-').map(num => parseInt(num, 10));
      
      if (isNaN(ano) || isNaN(mes) || isNaN(dia)) {
        return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')} • ${horaStr}`;
      }
      
      // Criar uma data válida (mês em JS é 0-indexed)
      const data = new Date(ano, mes - 1, dia);
      
      // Dias da semana em português
      const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const diaSemana = diasSemana[data.getDay()];
      
      // Formatação final sem o dia da semana
      return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')} • ${horaStr}`;
    } catch (e) {
      console.error('Erro ao formatar data:', e, dataStr);
      return `29/03 • 18:30`;  // Valor default caso haja erro
    }
  };

  // Retorna a cor do chip de status
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'agendado': return 'default';
      case 'em andamento': return 'warning';
      case 'finalizado': return 'success';
      case 'adiado': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
  }

  // Se não houver jogos, exibe uma mensagem
  if (jogos.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Não há jogos disponíveis para esta rodada.
      </Alert>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
        Jogos da {rodadaNumero}ª Rodada
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {jogos.map((jogo) => (
          <React.Fragment key={jogo.partida_id}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 'none'
                }
              }}
            >
              {/* Local e Data */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  {jogo.estadio?.nome_popular || 'Estádio não definido'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  {formatarData(jogo.data_realizacao, jogo.hora_realizacao)}
                </Typography>
                <Chip
                  label={jogo.status === 'agendado' ? 'FIQUE POR DENTRO' : jogo.status}
                  size="small"
                  color={jogo.status === 'agendado' ? 'success' : getStatusColor(jogo.status) as any}
                  sx={{
                    fontSize: '10px',
                    height: 20,
                    display: jogo.status === 'agendado' ? 'flex' : 'none'
                  }}
                />
              </Box>
              
              {/* Times e Placar */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1 }}>
                {/* Time Mandante */}
                <Box sx={{ display: 'flex', alignItems: 'center', width: '40%' }}>
                  <Avatar
                    src={jogo.time_mandante.escudo}
                    alt={jogo.time_mandante.sigla}
                    sx={{ width: 36, height: 36, mr: 1 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {jogo.time_mandante.nome_popular}
                  </Typography>
                </Box>
                
                {/* Placar */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20%' }}>
                  <Typography sx={{ mx: 1 }}>x</Typography>
                </Box>
                
                {/* Time Visitante */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '40%' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1 }}>
                    {jogo.time_visitante.nome_popular}
                  </Typography>
                  <Avatar
                    src={jogo.time_visitante.escudo}
                    alt={jogo.time_visitante.sigla}
                    sx={{ width: 36, height: 36 }}
                  />
                </Box>
              </Box>
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default JogosRodada;