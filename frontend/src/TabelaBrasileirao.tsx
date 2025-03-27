import React, { useState, useEffect } from 'react';
import { TabelaEntry } from './types';
// Importa componentes do Material UI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box'; // Para layout do escudo + nome

const TabelaBrasileirao: React.FC = () => {
  const [tabela, setTabela] = useState<TabelaEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/brasileirao/tabela')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: Falha ao buscar tabela`);
        }
        return response.json();
      })
      .then((data: TabelaEntry[]) => {
        setTabela(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching tabela:', err);
        setError(err.message || 'Ocorreu um erro ao buscar a tabela.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    // Usa CircularProgress do MUI para indicar carregamento
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    // Usa Alert do MUI para exibir erros
    return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
  }

  return (
    // Usa TableContainer com Paper para envolver a tabela
    <TableContainer component={Paper} sx={{ my: 4 }}> {/* Adiciona margem vertical */}
      <Typography variant="h6" component="div" sx={{ p: 2 }}> {/* Título com Typography */}
        Tabela Brasileirão 2025
      </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="tabela brasileirao">
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}> {/* Cabeçalho com fundo cinza claro */}
          <TableRow>
            {/* Células do cabeçalho com estilo */}
            <TableCell sx={{ fontWeight: 'bold' }}>Pos</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>P</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>J</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>V</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>E</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>D</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>GP</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>GC</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>SG</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tabela.map((entry) => (
            <TableRow
              key={entry.time.time_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }} // Remove borda da última linha
            >
              <TableCell component="th" scope="row">
                {entry.posicao}
              </TableCell>
              <TableCell>
                {/* Usa Box para alinhar escudo e nome */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img src={entry.time.escudo} alt={entry.time.sigla} width="20" style={{ marginRight: '8px' }} />
                  {entry.time.nome_popular}
                </Box>
              </TableCell>
              <TableCell align="right">{entry.pontos}</TableCell>
              <TableCell align="right">{entry.jogos}</TableCell>
              <TableCell align="right">{entry.vitorias}</TableCell>
              <TableCell align="right">{entry.empates}</TableCell>
              <TableCell align="right">{entry.derrotas}</TableCell>
              <TableCell align="right">{entry.gols_pro}</TableCell>
              <TableCell align="right">{entry.gols_contra}</TableCell>
              <TableCell align="right">{entry.saldo_gols}</TableCell>
              <TableCell align="right">{entry.aproveitamento}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TabelaBrasileirao;