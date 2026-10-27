import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listarPesquisas, exportarPesquisasCSV } from '../api/pesquisa';
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
    setor: '',
    situacao_atual: '',
    atividade_securitario: '',
    afastamento_saude_mental: '',
    data_inicio: '',
    data_fim: '',
  });

  const fetchRespostas = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const paramsWithPage = { ...params, page: currentPage };
      const response = await listarPesquisas(paramsWithPage);
      setRespostas(response.data.results);
      setTotalCount(response.data.count);
      setTotalPages(Math.ceil(response.data.count / ITEMS_PER_PAGE));
    } catch (err) {
      setError('Erro ao carregar respostas.');
      console.error(err);
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
    if (filtros.setor) params.setor = filtros.setor;
    if (filtros.situacao_atual) params.situacao_atual = filtros.situacao_atual;
    if (filtros.atividade_securitario) params.atividade_securitario = filtros.atividade_securitario;
    if (filtros.afastamento_saude_mental) params.afastamento_saude_mental = filtros.afastamento_saude_mental;
    if (filtros.data_inicio) params.data_inicio = filtros.data_inicio;
    if (filtros.data_fim) params.data_fim = filtros.data_fim;
    fetchRespostas(params);
  };

  const limparFiltros = () => {
    setFiltros({
      setor: '',
      situacao_atual: '',
      atividade_securitario: '',
      afastamento_saude_mental: '',
      data_inicio: '',
      data_fim: '',
    });
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
      if (filtros.setor) params.setor = filtros.setor;
      if (filtros.situacao_atual) params.situacao_atual = filtros.situacao_atual;
      if (filtros.atividade_securitario) params.atividade_securitario = filtros.atividade_securitario;
      if (filtros.afastamento_saude_mental) params.afastamento_saude_mental = filtros.afastamento_saude_mental;
      if (filtros.data_inicio) params.data_inicio = filtros.data_inicio;
      if (filtros.data_fim) params.data_fim = filtros.data_fim;

      const response = await exportarPesquisasCSV(params);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `denuncias_${new Date().toISOString().slice(0, 10)}.csv`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erro ao exportar dados.');
      console.error(err);
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

  const valor = (v) => (v === null || v === undefined || v === '' ? 'N/A' : v);

  const formatarFuncaoEfetiva = (lista) => {
    if (!lista || lista.length === 0) return 'N/A';
    return lista.join(', ');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Listagem de Respostas</h2>
      <p className={styles.subtitle}>Bem-vindo, {user?.username}!</p>

      {/* Filtros */}
      <div className={styles.filters}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label>Setor</label>
            <select name="setor" value={filtros.setor} onChange={handleChange}>
              <option value="">Todos</option>
              <option value="vendas">Vendas</option>
              <option value="sac">SAC</option>
              <option value="renovacao">Renovação</option>
              <option value="endosso">Endosso</option>
              <option value="backoffice">Backoffice</option>
              <option value="cobranca">Cobrança</option>
              <option value="qualidade_monitoria">Qualidade/Monitoria</option>
              <option value="treinamento">Treinamento</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Situação</label>
            <select name="situacao_atual" value={filtros.situacao_atual} onChange={handleChange}>
              <option value="">Todas</option>
              <option value="ativo">Ativo</option>
              <option value="ex_12meses">Ex (até 12 meses)</option>
              <option value="ex_mais_1ano">Ex (mais de 1 ano)</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Atividade securitário</label>
            <select name="atividade_securitario" value={filtros.atividade_securitario} onChange={handleChange}>
              <option value="">Todas</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="em_partes">Em partes</option>
              <option value="outra_funcao">Outra função</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Afastamento saúde mental</label>
            <select name="afastamento_saude_mental" value={filtros.afastamento_saude_mental} onChange={handleChange}>
              <option value="">Todos</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="prefiro_nao_responder">Prefiro não responder</option>
            </select>
          </div>
        </div>
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
            <button
              className={styles.btnExport}
              onClick={handleExport}
              disabled={exporting || respostas.length === 0}
            >
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
                  <th>Número da denúncia</th>
                  <th>Data/Hora</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {respostas.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{formatDateTime(item.data_submissao)}</td>
                    <td>
                      <button className={styles.btnDetail} onClick={() => openModal(item)}>
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                Anterior
              </button>
              <span>Página {currentPage} de {totalPages}</span>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Próxima
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal (mantenha o mesmo conteúdo da versão anterior) */}
      <Modal
        isOpen={modalOpen}
        title={`Denúncia #${selected?.id}`}
        onConfirm={closeModal}
        confirmText="Fechar"
      >
        {selected && (
          <div className={styles.detalhes}>
            {/* ... todo o conteúdo do modal anterior ... */}
            <h3>Consentimento</h3>
            <p><strong>Consentimento:</strong> {selected.consentimento ? 'Sim' : 'Não'}</p>
            <h3>Identificação e vínculo</h3>
            <p><strong>Setor:</strong> {valor(selected.setor)}</p>
            {selected.setor === 'outro' && <p><strong>Outro setor:</strong> {valor(selected.setor_outro)}</p>}
            <p><strong>Cargo formal:</strong> {valor(selected.cargo_formal)}</p>
            {selected.cargo_formal === 'outro' && <p><strong>Outro cargo:</strong> {valor(selected.cargo_formal_outro)}</p>}
            <p><strong>Função efetiva:</strong> {formatarFuncaoEfetiva(selected.funcao_efetiva)}</p>
            {selected.funcao_efetiva?.includes('outro') && <p><strong>Outra função:</strong> {valor(selected.funcao_efetiva_outro)}</p>}
            <p><strong>Situação atual:</strong> {valor(selected.situacao_atual)}</p>
            <p><strong>Supervisão:</strong> {valor(selected.supervisao)}</p>
            <p><strong>Tempo de empresa:</strong> {valor(selected.tempo_empresa)}</p>
            <h3>Atividades e função</h3>
            <p><strong>Atividade securitário:</strong> {valor(selected.atividade_securitario)}</p>
            <p><strong>Atividade extra cargo:</strong> {valor(selected.atividade_extra_cargo)}</p>
            {selected.atividade_extra_cargo_descricao && (
              <p><strong>Descrição atividade extra:</strong> {selected.atividade_extra_cargo_descricao}</p>
            )}
            <p><strong>Metas definição:</strong> {valor(selected.metas_definicao)}</p>
            {selected.metas_definicao_descricao && (
              <p><strong>Descrição metas:</strong> {selected.metas_definicao_descricao}</p>
            )}
            <p><strong>Metas realismo (1-5):</strong> {valor(selected.metas_realismo)}</p>
            <p><strong>Cobrança fora do controle:</strong> {valor(selected.cobranca_fora_controle)}</p>
            {selected.cobranca_fora_controle_exemplos && (
              <p><strong>Exemplos cobrança:</strong> {selected.cobranca_fora_controle_exemplos}</p>
            )}
            <p><strong>Metas com pressão:</strong> {valor(selected.metas_pressao)}</p>
            <p><strong>Metas abusivas:</strong> {valor(selected.metas_abusivas)}</p>
            {selected.metas_caso_especifico && (
              <p><strong>Caso específico:</strong> {selected.metas_caso_especifico}</p>
            )}
            <h3>Remuneração</h3>
            <p><strong>Faixa de remuneração:</strong> {valor(selected.remuneracao_faixa)}</p>
            <p><strong>Bonificações:</strong> {valor(selected.bonificacoes_faixa)}</p>
            <p><strong>Recebe comissão:</strong> {valor(selected.recebe_comissao)}</p>
            <p><strong>Aumento de atribuições:</strong> {valor(selected.aumento_atribuicoes)}</p>
            {selected.aumento_atribuicoes_descricao && (
              <p><strong>Descrição aumento:</strong> {selected.aumento_atribuicoes_descricao}</p>
            )}
            <h3>Treinamento</h3>
            <p><strong>Duração treinamento:</strong> {valor(selected.treinamento_duracao)}</p>
            <p><strong>Preparação (1-5):</strong> {valor(selected.treinamento_preparacao)}</p>
            <p><strong>Treinamento supervisor:</strong> {valor(selected.treinamento_supervisor)}</p>
            <h3>Jornada, pausas e horas extras</h3>
            <p><strong>Pausas suficientes:</strong> {valor(selected.pausas_suficientes)}</p>
            <p><strong>Duração pausas:</strong> {valor(selected.pausas_duracao)}</p>
            {selected.pausas_descricao && (
              <p><strong>Descrição pausas:</strong> {selected.pausas_descricao}</p>
            )}
            <p><strong>Horas extras pagas:</strong> {valor(selected.horas_extras_pagas)}</p>
            <p><strong>Horas extras não compensadas:</strong> {valor(selected.horas_extras_nao_compensadas)}</p>
            {selected.horas_extras_relato && (
              <p><strong>Relato horas extras:</strong> {selected.horas_extras_relato}</p>
            )}
            <h3>Monitoria e avaliação</h3>
            <p><strong>Tipo de monitoramento:</strong> {valor(selected.monitoramento_tipo)}</p>
            {selected.monitoramento_tipo === 'outro' && (
              <p><strong>Outro monitoramento:</strong> {valor(selected.monitoramento_outro)}</p>
            )}
            <p><strong>Avaliação CX (1-5):</strong> {valor(selected.cx_avaliacao)}</p>
            <p><strong>Remuneração afetada por monitoria:</strong> {valor(selected.remuneracao_afetada_monitoria)}</p>
            {selected.remuneracao_monitoria_descricao && (
              <p><strong>Descrição monitoria:</strong> {selected.remuneracao_monitoria_descricao}</p>
            )}
            <h3>Saúde mental e adoecimento</h3>
            <p><strong>Afastamento saúde mental:</strong> {valor(selected.afastamento_saude_mental)}</p>
            {selected.afastamento_saude_mental === 'sim' && (
              <>
                <p><strong>Duração afastamento:</strong> {valor(selected.afastamento_duracao)}</p>
                <p><strong>Retorno da empresa:</strong> {valor(selected.afastamento_retorno)}</p>
                {selected.afastamento_detalhes && (
                  <p><strong>Detalhes afastamento:</strong> {selected.afastamento_detalhes}</p>
                )}
              </>
            )}
            <p><strong>Relação pressão/adoecimento:</strong> {valor(selected.relacao_pressao_adoecimento)}</p>
            {selected.relacao_pressao_exemplos && (
              <p><strong>Exemplos:</strong> {selected.relacao_pressao_exemplos}</p>
            )}
            <p><strong>Humilhação/sobrecarga:</strong> {valor(selected.humilhacao)}</p>
            {selected.humilhacao_descricao && (
              <p><strong>Descrição:</strong> {selected.humilhacao_descricao}</p>
            )}
            <h3>Rotatividade e desligamento</h3>
            <p><strong>Rotatividade:</strong> {valor(selected.rotatividade)}</p>
            <p><strong>Pressão para desligamento:</strong> {valor(selected.pressao_desligamento)}</p>
            <p><strong>Justa causa injustificada:</strong> {valor(selected.justa_causa_injustificada)}</p>
            {selected.desligamento_descricao && (
              <p><strong>Descrição desligamento:</strong> {selected.desligamento_descricao}</p>
            )}
            <p><strong>Casos na Justiça:</strong> {valor(selected.casos_justica)}</p>
            {selected.casos_justica_descricao && (
              <p><strong>Descrição casos Justiça:</strong> {selected.casos_justica_descricao}</p>
            )}
            <h3>Diversidade e discriminação</h3>
            <p><strong>Desigualdade de representação:</strong> {valor(selected.desigualdade_representacao)}</p>
            {selected.desigualdade_descricao && (
              <p><strong>Descrição desigualdade:</strong> {selected.desigualdade_descricao}</p>
            )}
            <p><strong>Racismo/assédio/discriminação:</strong> {valor(selected.racismo_assédio)}</p>
            {selected.empresa_resposta && (
              <p><strong>Resposta da empresa:</strong> {selected.empresa_resposta}</p>
            )}
            {selected.discriminacao_descricao && (
              <p><strong>Descrição discriminação:</strong> {selected.discriminacao_descricao}</p>
            )}
            <p><strong>Nepotismo:</strong> {valor(selected.nepotismo)}</p>
            {selected.nepotismo_descricao && (
              <p><strong>Descrição nepotismo:</strong> {selected.nepotismo_descricao}</p>
            )}
            <h3>Campo final</h3>
            <p><strong>Observações finais:</strong> {valor(selected.observacoes_finais)}</p>
            <p><strong>Data da submissão:</strong> {formatDateTime(selected.data_submissao)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ListagemRespostas;