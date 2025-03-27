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
          setJogos(data.partidas);
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

  // Formata a data para exibição
  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long'
    });
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
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {jogos.map((jogo) => (
          <Box 
            key={jogo.partida_id} 
            sx={{ 
              width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' },
              mb: 2
            }}
          >
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Status do jogo */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                  <Chip 
                    label={jogo.status} 
                    size="small" 
                    color={getStatusColor(jogo.status) as any}
                  />
                </Box>
                
                {/* Times e placar */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}>
                    <Avatar 
                      src={jogo.time_mandante.escudo} 
                      alt={jogo.time_mandante.sigla}
                      sx={{ width: 56, height: 56, mb: 1 }}
                    />
                    <Typography variant="body2" align="center">
                      {jogo.time_mandante.nome_popular}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20%' }}>
                    <Typography variant="h5" component="span" sx={{ fontWeight: 'bold' }}>
                      {jogo.placar_mandante !== null ? jogo.placar_mandante : '-'}
                    </Typography>
                    <Typography variant="h5" component="span" sx={{ mx: 1 }}>x</Typography>
                    <Typography variant="h5" component="span" sx={{ fontWeight: 'bold' }}>
                      {jogo.placar_visitante !== null ? jogo.placar_visitante : '-'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}>
                    <Avatar 
                      src={jogo.time_visitante.escudo} 
                      alt={jogo.time_visitante.sigla}
                      sx={{ width: 56, height: 56, mb: 1 }}
                    />
                    <Typography variant="body2" align="center">
                      {jogo.time_visitante.nome_popular}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                {/* Informações do jogo */}
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatarData(jogo.data_realizacao)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {jogo.hora_realizacao}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StadiumIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {jogo.estadio?.nome_popular || 'Estádio não definido'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default JogosRodada;