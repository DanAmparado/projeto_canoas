import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listarRespostas, exportarRespostasCSV } from '../api/respostas';
import Modal from '../components/shared/Modal';
import Spinner from '../components/shared/Spinner';
import styles from './ListagemRespostas.module.css';

const ITEMS_PER_PAGE = 10;

const ListagemRespostas = () => {
  const { user } = useAuth();
  const [respostas, setRespostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filtros, setFiltros] = useState({
    data_inicio: '',
    data_fim: '',
  });

  const fetchRespostas = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const paramsWithPage = { ...params, page: currentPage };
      const response = await listarRespostas(paramsWithPage);
      setRespostas(response.data.results);
      setTotalCount(response.data.count);
      setTotalPages(Math.ceil(response.data.count / ITEMS_PER_PAGE));
    } catch (err) {
      setError('Erro ao carregar respostas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRespostas();
  }, [currentPage]);

  const aplicarFiltros = () => {
    setCurrentPage(1);
    const params = {};
    if (filtros.data_inicio) params.data_inicio = filtros.data_inicio;
    if (filtros.data_fim) params.data_fim = filtros.data_fim;
    fetchRespostas(params);
  };

  const limparFiltros = () => {
    setFiltros({ data_inicio: '', data_fim: '' });
    setCurrentPage(1);
    fetchRespostas();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = {};
      if (filtros.data_inicio) params.data_inicio = filtros.data_inicio;
      if (filtros.data_fim) params.data_fim = filtros.data_fim;

      const response = await exportarRespostasCSV(params);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `respostas_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erro ao exportar dados.');
    } finally {
      setExporting(false);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const openModal = (item) => {
    setSelected(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Listagem de Respostas</h2>
      <p className={styles.subtitle}>Bem-vindo, {user?.username}!</p>

      <div className={styles.filters}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label>Data Início</label>
            <input type="date" name="data_inicio" value={filtros.data_inicio} onChange={handleChange} />
          </div>
          <div className={styles.filterGroup}>
            <label>Data Fim</label>
            <input type="date" name="data_fim" value={filtros.data_fim} onChange={handleChange} />
          </div>
          <div className={styles.filterActions}>
            <button className={styles.btnPrimary} onClick={aplicarFiltros}>Filtrar</button>
            <button className={styles.btnSecondary} onClick={limparFiltros}>Limpar</button>
            <button className={styles.btnExport} onClick={handleExport} disabled={exporting || respostas.length === 0}>
              {exporting ? 'Exportando...' : 'Exportar CSV'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : respostas.length === 0 ? (
        <div className={styles.empty}>Nenhuma resposta encontrada.</div>
      ) : (
        <>
          <p className={styles.totalCount}>Total: {totalCount} respostas</p>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data/Hora</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {respostas.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{formatDateTime(item.data_submissao)}</td>
                    <td>{item.nome || '-'}</td>
                    <td>{item.email || '-'}</td>
                    <td>
                      <button className={styles.btnDetail} onClick={() => openModal(item)}>Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
              <span>Página {currentPage} de {totalPages}</span>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Próxima</button>
            </div>
          )}
        </>
      )}

      <Modal isOpen={modalOpen} title={`Resposta #${selected?.id}`} onConfirm={closeModal} confirmText="Fechar">
        {selected && (
          <div className={styles.detalhes}>
            <p><strong>ID:</strong> {selected.id}</p>
            <p><strong>Data:</strong> {formatDateTime(selected.data_submissao)}</p>
            <p><strong>Nome:</strong> {selected.nome || 'Não informado'}</p>
            <p><strong>E-mail:</strong> {selected.email || 'Não informado'}</p>
            <h3>Mensagem</h3>
            <div className={styles.observacoesCompletas}>
              {selected.mensagem}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ListagemRespostas;