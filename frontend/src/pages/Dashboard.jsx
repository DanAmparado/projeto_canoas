import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getResumoPesquisas } from '../api/pesquisa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Spinner from '../components/shared/Spinner';
import styles from './Dashboard.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const CORES = [
  'rgba(255, 99, 132, 0.6)',
  'rgba(54, 162, 235, 0.6)',
  'rgba(255, 206, 86, 0.6)',
  'rgba(75, 192, 192, 0.6)',
  'rgba(153, 102, 255, 0.6)',
  'rgba(255, 159, 64, 0.6)',
  'rgba(199, 199, 199, 0.6)',
  'rgba(83, 102, 255, 0.6)',
  'rgba(255, 99, 255, 0.6)',
];

const MAPA_ROTULOS = {
  // Setor
  vendas: 'Vendas',
  sac: 'SAC',
  renovacao: 'Renovação',
  endosso: 'Endosso',
  backoffice: 'Backoffice',
  cobranca: 'Cobrança',
  qualidade_monitoria: 'Qualidade/Monitoria',
  treinamento: 'Treinamento',
  outro: 'Outro',
  // Situação
  ativo: 'Ativo',
  ex_12meses: 'Ex (até 12 meses)',
  ex_mais_1ano: 'Ex (mais de 1 ano)',
  // Atividade securitário
  sim: 'Sim',
  nao: 'Não',
  em_partes: 'Em partes',
  outra_funcao: 'Outra função',
  // Afastamento
  prefiro_nao_responder: 'Prefiro não responder',
  // Tempo de empresa
  menos_3_meses: 'Menos de 3 meses',
  '3a6_meses': '3 a 6 meses',
  '6meses_1ano': '6 meses a 1 ano',
  '1a2_anos': '1 a 2 anos',
  '2a5_anos': '2 a 5 anos',
  '5a10_anos': '5 a 10 anos',
  mais_10_anos: 'Mais de 10 anos',
  // Rotatividade
  nao_sei: 'Não sei',
  // Desigualdade
  nao_percebo: 'Não percebo',
  percebo_parcialmente: 'Percebo parcialmente',
  percebo_fortemente: 'Percebo fortemente',
};

const rotulo = (valor) => MAPA_ROTULOS[valor] || valor || 'N/A';

const Dashboard = () => {
  const { user } = useAuth();
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumo = async () => {
      try {
        const response = await getResumoPesquisas();
        setDados(response.data);
      } catch (err) {
        setError('Erro ao carregar dados do dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumo();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <Spinner />
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (error) return <div className={styles.error}>{error}</div>;
  if (!dados) return <div className={styles.error}>Nenhum dado disponível.</div>;

  // Dados para gráfico de barras: situação
  const situacaoLabels = dados.por_situacao.map((item) => rotulo(item.situacao_atual));
  const situacaoCounts = dados.por_situacao.map((item) => item.count);
  const barSituacaoData = {
    labels: situacaoLabels,
    datasets: [
      {
        label: 'Respostas',
        data: situacaoCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Dados para gráfico de pizza: setor
  const setorLabels = dados.por_setor.map((item) => rotulo(item.setor));
  const setorCounts = dados.por_setor.map((item) => item.count);
  const pieSetorData = {
    labels: setorLabels,
    datasets: [
      {
        label: 'Respostas',
        data: setorCounts,
        backgroundColor: CORES,
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 2,
      },
    ],
  };

  // Dados para gráfico de pizza: atividade securitário
  const atividadeLabels = dados.por_atividade.map((item) => rotulo(item.atividade_securitario));
  const atividadeCounts = dados.por_atividade.map((item) => item.count);
  const pieAtividadeData = {
    labels: atividadeLabels,
    datasets: [
      {
        label: 'Respostas',
        data: atividadeCounts,
        backgroundColor: CORES,
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 2,
      },
    ],
  };

  // Dados para gráfico de pizza: afastamento saúde mental
  const afastamentoLabels = dados.por_afastamento.map((item) => rotulo(item.afastamento_saude_mental));
  const afastamentoCounts = dados.por_afastamento.map((item) => item.count);
  const pieAfastamentoData = {
    labels: afastamentoLabels,
    datasets: [
      {
        label: 'Respostas',
        data: afastamentoCounts,
        backgroundColor: CORES,
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 2,
      },
    ],
  };

  // Dados para gráfico de barras: tempo de empresa
  const tempoLabels = dados.por_tempo_empresa.map((item) => rotulo(item.tempo_empresa));
  const tempoCounts = dados.por_tempo_empresa.map((item) => item.count);
  const barTempoData = {
    labels: tempoLabels,
    datasets: [
      {
        label: 'Respostas',
        data: tempoCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Dados para gráfico de barras: rotatividade
  const rotatividadeLabels = dados.por_rotatividade.map((item) => rotulo(item.rotatividade));
  const rotatividadeCounts = dados.por_rotatividade.map((item) => item.count);
  const barRotatividadeData = {
    labels: rotatividadeLabels,
    datasets: [
      {
        label: 'Respostas',
        data: rotatividadeCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Dados para gráfico de barras: desigualdade
  const desigualdadeLabels = dados.por_desigualdade.map((item) => rotulo(item.desigualdade_representacao));
  const desigualdadeCounts = dados.por_desigualdade.map((item) => item.count);
  const barDesigualdadeData = {
    labels: desigualdadeLabels,
    datasets: [
      {
        label: 'Respostas',
        data: desigualdadeCounts,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dashboard de Denúncias</h2>
      <p className={styles.subtitle}>Bem-vindo, {user?.username}!</p>

      {/* Cards de resumo */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total de respostas</h3>
          <p className={styles.cardValue}>{dados.total}</p>
        </div>
        <div className={styles.card}>
          <h3>Média realismo das metas</h3>
          <p className={styles.cardValue}>{dados.media_realismo_metas}</p>
          <small>Escala 1 a 5</small>
        </div>
        <div className={styles.card}>
          <h3>Média preparação treinamento</h3>
          <p className={styles.cardValue}>{dados.media_treinamento}</p>
          <small>Escala 1 a 5</small>
        </div>
        <div className={styles.card}>
          <h3>Média avaliação CX</h3>
          <p className={styles.cardValue}>{dados.media_cx}</p>
          <small>1=Punitiva / 5=Educativa</small>
        </div>
      </div>

      {/* Linha 1: Situação + Setor */}
      <div className={styles.chartsRow}>
        <div className={styles.chartBox}>
          <h3>Distribuição por situação</h3>
          <Bar data={barSituacaoData} options={{ responsive: true }} />
        </div>
        <div className={styles.chartBox}>
          <h3>Distribuição por setor</h3>
          <Pie data={pieSetorData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Linha 2: Atividade securitário + Afastamento */}
      <div className={styles.chartsRow}>
        <div className={styles.chartBox}>
          <h3>Atividade típica de securitário</h3>
          <Pie data={pieAtividadeData} options={{ responsive: true }} />
        </div>
        <div className={styles.chartBox}>
          <h3>Afastamento por saúde mental</h3>
          <Pie data={pieAfastamentoData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Linha 3: Tempo de empresa */}
      <div className={styles.fullWidthChart}>
        <h3>Tempo de empresa</h3>
        <Bar data={barTempoData} options={{ responsive: true }} />
      </div>

      {/* Linha 4: Rotatividade + Desigualdade */}
      <div className={styles.chartsRow}>
        <div className={styles.chartBox}>
          <h3>Percepção de rotatividade</h3>
          <Bar data={barRotatividadeData} options={{ responsive: true }} />
        </div>
        <div className={styles.chartBox}>
          <h3>Desigualdade de representação</h3>
          <Bar data={barDesigualdadeData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;