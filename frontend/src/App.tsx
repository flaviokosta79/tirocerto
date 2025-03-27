import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Campeonato } from './types';
import TabelaBrasileirao from './TabelaBrasileirao';
import JogosRodada from './JogosRodada';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Tabs,
  Tab,
  Button,
  Paper,
  Avatar,
  IconButton
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Configura tema personalizado com cores do Brasileirão
const theme = createTheme({
  palette: {
    primary: {
      main: '#006b3f', // Verde do Brasileirão
    },
    secondary: {
      main: '#ffd700', // Amarelo ouro
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

// Interface para as abas
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Componente para o conteúdo das abas
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Verificando...');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [rodadaAtual, setRodadaAtual] = useState(1);

  // Gerenciador de mudança de aba
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    // Busca status do backend
    fetch('/api/health')
      .then(response => response.json())
      .then(data => {
        setBackendStatus(data.status === 'UP' ? 'Conectado!' : 'Erro na conexão');
        setLoading(false);
      })
      .catch(() => {
        setBackendStatus('Erro na conexão');
        setLoading(false);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header principal */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <SportsSoccerIcon sx={{ mr: 2, fontSize: 28 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Fantasy Brasileirão 2025
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={`Backend: ${backendStatus}`} 
                color={backendStatus === 'Conectado!' ? 'success' : 'error'}
                size="small"
                sx={{ mr: 2 }}
              />
              <IconButton color="inherit" size="small" sx={{ mr: 1 }}>
                <NotificationsIcon />
              </IconButton>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                <AccountCircleIcon />
              </Avatar>
            </Box>
          </Toolbar>
          
          {/* Navegação principal */}
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ 
              bgcolor: 'primary.dark',
              '& .MuiTab-root': { 
                minHeight: '56px',
                fontSize: '0.9rem',
                fontWeight: 'medium'
              }
            }}
          >
            <Tab icon={<HomeIcon />} label="Início" iconPosition="start" />
            <Tab icon={<LeaderboardIcon />} label="Classificação" iconPosition="start" />
            <Tab icon={<CalendarTodayIcon />} label="Jogos" iconPosition="start" />
            <Tab icon={<EmojiEventsIcon />} label="Minhas Apostas" iconPosition="start" />
          </Tabs>
        </AppBar>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          </Container>
        ) : (
          <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
            {/* Conteúdo das abas */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 4 }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    backgroundImage: 'linear-gradient(to right, #006b3f, #00a86b)',
                    color: 'white',
                    mb: 4
                  }}
                >
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Bem-vindo ao Fantasy Brasileirão 2025!
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Faça suas apostas, acompanhe os resultados e dispute com seus amigos quem entende mais de futebol.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large"
                    sx={{ color: '#006b3f', fontWeight: 'bold' }}
                  >
                    Fazer Aposta
                  </Button>
                </Paper>
                
                <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main', mb: 3, fontWeight: 'bold' }}>
                  Próximos Jogos
                </Typography>
                <JogosRodada rodadaNumero={rodadaAtual} />
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main', mb: 3, fontWeight: 'bold' }}>
                Classificação do Brasileirão
              </Typography>
              <TabelaBrasileirao />
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', mb: 0 }}>
                  Jogos por Rodada
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    disabled={rodadaAtual <= 1}
                    onClick={() => setRodadaAtual(prev => Math.max(1, prev - 1))}
                  >
                    Anterior
                  </Button>
                  <Typography variant="body1" sx={{ mx: 2, fontWeight: 'medium' }}>
                    Rodada {rodadaAtual}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    disabled={rodadaAtual >= 38}
                    onClick={() => setRodadaAtual(prev => Math.min(38, prev + 1))}
                  >
                    Próxima
                  </Button>
                </Box>
              </Box>
              <JogosRodada rodadaNumero={rodadaAtual} />
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main', mb: 3, fontWeight: 'bold' }}>
                Minhas Apostas
              </Typography>
              <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                <EmojiEventsIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Você ainda não fez nenhuma aposta
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Comece a apostar nos jogos do Brasileirão e acompanhe sua pontuação.
                </Typography>
                <Button variant="contained" color="primary" size="large">
                  Fazer Minha Primeira Aposta
                </Button>
              </Paper>
            </TabPanel>
          </Container>
        )}

        <Box component="footer" sx={{ bgcolor: 'primary.main', py: 2, mt: 'auto' }}>
          <Container maxWidth="lg">
            <Typography variant="body2" color="white" align="center">
              © 2025 Fantasy Brasileirão - Todos os direitos reservados
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
