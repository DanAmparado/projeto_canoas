import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getResumoRespostas } from '../api/respostas';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Spinner from '../components/shared/Spinner';
import styles from './Dashboard.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumo = async () => {
      try {
        const response = await getResumoRespostas();
        setDados(response.data);
      } catch (err) {
        setError('Erro ao carregar dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchResumo();
  }, []);

  if (loading) {
    return <div className={styles.loadingWrapper}><Spinner /><p>Carregando...</p></div>;
  }

  if (error) return <div className={styles.error}>{error}</div>;
  if (!dados) return <div className={styles.error}>Nenhum dado disponível.</div>;

  // Dados do gráfico diário
  const diasLabels = dados.diario_30dias.map((item) => {
    const [ano, mes, dia] = item.dia.split('-');
    return `${dia}/${mes}`;
  });
  const diasCounts = dados.diario_30dias.map((item) => item.count);

  const barData = {
    labels: diasLabels,
    datasets: [
      {
        label: 'Respostas por dia',
        data: diasCounts,
        backgroundColor: 'rgba(255, 200, 0, 0.6)',
        borderColor: 'rgba(255, 200, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dashboard</h2>
      <p className={styles.subtitle}>Bem-vindo, {user?.username}!</p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total de respostas</h3>
          <p className={styles.cardValue}>{dados.total}</p>
        </div>
      </div>

      <div className={styles.fullWidthChart}>
        <h3>Respostas nos últimos 30 dias</h3>
        <Bar data={barData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default Dashboard;