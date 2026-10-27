import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { enviarPesquisa } from '../api/pesquisa';
import styles from './FormularioPublico.module.css';

const DRAFT_KEY = 'rascunho_denuncia';

const FormularioPublico = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [slowResponse, setSlowResponse] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [draftRestored, setDraftRestored] = useState(false);
  const captchaRef = useRef(null);

  const estadoInicial = {
    consentimento: false,
    setor: '',
    setor_outro: '',
    cargo_formal: '',
    cargo_formal_outro: '',
    funcao_efetiva: [],
    funcao_efetiva_outro: '',
    situacao_atual: '',
    supervisao: '',
    tempo_empresa: '',
    atividade_securitario: '',
    atividade_extra_cargo: '',
    atividade_extra_cargo_descricao: '',
    metas_definicao: '',
    metas_definicao_descricao: '',
    metas_realismo: 0,
    cobranca_fora_controle: '',
    cobranca_fora_controle_exemplos: '',
    metas_pressao: '',
    metas_abusivas: '',
    metas_caso_especifico: '',
    remuneracao_faixa: '',
    bonificacoes_faixa: '',
    recebe_comissao: '',
    aumento_atribuicoes: '',
    aumento_atribuicoes_descricao: '',
    treinamento_duracao: '',
    treinamento_preparacao: 0,
    treinamento_supervisor: '',
    pausas_suficientes: '',
    pausas_duracao: '',
    pausas_descricao: '',
    horas_extras_pagas: '',
    horas_extras_nao_compensadas: '',
    horas_extras_relato: '',
    monitoramento_tipo: '',
    monitoramento_outro: '',
    cx_avaliacao: 0,
    remuneracao_afetada_monitoria: '',
    remuneracao_monitoria_descricao: '',
    afastamento_saude_mental: '',
    afastamento_duracao: '',
    afastamento_retorno: '',
    afastamento_detalhes: '',
    relacao_pressao_adoecimento: '',
    relacao_pressao_exemplos: '',
    humilhacao: '',
    humilhacao_descricao: '',
    rotatividade: '',
    pressao_desligamento: '',
    justa_causa_injustificada: '',
    desligamento_descricao: '',
    casos_justica: '',
    casos_justica_descricao: '',
    desigualdade_representacao: '',
    desigualdade_descricao: '',
    racismo_assédio: '',
    empresa_resposta: '',
    discriminacao_descricao: '',
    nepotismo: '',
    nepotismo_descricao: '',
    observacoes_finais: '',
  };

  const [formData, setFormData] = useState(estadoInicial);

  const numericFields = ['metas_realismo', 'treinamento_preparacao', 'cx_avaliacao'];

  // Restaura rascunho ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.consentimento || parsed.setor || parsed.observacoes_finais)) {
          setFormData((prev) => ({ ...prev, ...parsed }));
          setDraftRestored(true);
        }
      }
    } catch (err) {
      console.warn('Erro ao restaurar rascunho:', err);
    }
  }, []);

  // Salva rascunho a cada mudança
  useEffect(() => {
    try {
      if (loading || success) return;
      const temConteudo = Object.entries(formData).some(([key, value]) => {
        if (key === 'funcao_efetiva') return value && value.length > 0;
        if (typeof value === 'boolean') return value;
        return value !== '' && value !== 0 && value !== null && value !== undefined;
      });
      if (!temConteudo) return;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch (err) {
      console.warn('Erro ao salvar rascunho:', err);
    }
  }, [formData, loading, success]);

  const limparRascunho = () => {
    localStorage.removeItem(DRAFT_KEY);
    setFormData(estadoInicial);
    setDraftRestored(false);
  };

  // Avisa antes de sair com dados não salvos
  useEffect(() => {
    const handler = (e) => {
      // Não avisa se está enviando ou se já enviou com sucesso
      if (loading || success) return;

      // Verifica se há conteúdo relevante preenchido
      const temConteudo =
        formData.consentimento ||
        formData.setor ||
        formData.cargo_formal ||
        (formData.funcao_efetiva && formData.funcao_efetiva.length > 0) ||
        formData.situacao_atual ||
        formData.observacoes_finais;

      if (temConteudo) {
        e.preventDefault();
        // Navegadores modernos ignoram o texto customizado e mostram mensagem padrão
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [formData, loading, success]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    if (numericFields.includes(name) && type !== 'checkbox') {
      newValue = parseInt(value, 10) || 0;
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setError('');
    setSuccess(false);
  };

  const handleMultiSelect = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const lista = prev.funcao_efetiva || [];
      if (checked) {
        return { ...prev, funcao_efetiva: [...lista, value] };
      } else {
        return { ...prev, funcao_efetiva: lista.filter((v) => v !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consentimento) {
      setError('Você precisa concordar com os termos para participar.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!captchaToken) {
      setError('Por favor, confirme que você não é um robô.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setSlowResponse(false);
    setError('');
    setSuccess(false);

    const slowTimer = setTimeout(() => setSlowResponse(true), 4000);

    try {
      const dadosComCaptcha = { ...formData, hcaptcha: captchaToken };
      await enviarPesquisa(dadosComCaptcha);
      localStorage.removeItem(DRAFT_KEY);
      setSuccess(true);
      setFormData(estadoInicial);
      setCaptchaToken('');
      captchaRef.current?.resetCaptcha();
      setTimeout(() => navigate('/obrigado'), 2000);
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Você enviou muitas denúncias recentemente. Aguarde uma hora e tente novamente.');
      } else if (err.response?.data?.hcaptcha) {
        setError('A verificação de segurança falhou. Tente novamente.');
      } else {
        setError('Erro ao enviar sua resposta. Tente novamente.');
      }
      captchaRef.current?.resetCaptcha();
      setCaptchaToken('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      clearTimeout(slowTimer);
      setSlowResponse(false);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.submitOverlay} role="status" aria-live="polite">
          <div className={styles.submitOverlayContent}>
            <div className={styles.spinner}></div>
            {slowResponse ? (
              <>
                <h2 className={styles.overlayTitle}>O servidor está iniciando</h2>
                <p className={styles.overlayText}>
                  Isso pode levar até 1 minuto na primeira vez do dia. Aguarde, por favor.
                  Não feche esta página.
                </p>
              </>
            ) : (
              <>
                <h2 className={styles.overlayTitle}>Enviando denúncia...</h2>
                <p className={styles.overlayText}>
                  Aguarde enquanto registramos sua resposta.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <h1 className={styles.title}>Pesquisa de Condições de Trabalho</h1>
      <p className={styles.intro}>
        Este formulário é totalmente anônimo. Suas respostas serão usadas de forma agregada.
      </p>

      <div className={styles.legend}>
        Os campos sem indicação são obrigatórios. Campos com <strong>(opcional)</strong> podem
        ser deixados em branco.
      </div>

      {draftRestored && (
        <div className={styles.draftNotice}>
          <span>Rascunho restaurado automaticamente.</span>
          <button type="button" onClick={limparRascunho} className={styles.draftClear}>
            Limpar rascunho
          </button>
        </div>
      )}

      {success && (
        <div className={styles.success}>
          Sua resposta foi enviada com sucesso! Você será redirecionado em instantes.
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* BLOCO 1: CONSENTIMENTO */}
        <section className={styles.section}>
          <h2>Consentimento e anonimato</h2>
          <p>Este formulário é 100 por cento anônimo. Nenhum dado de identificação é coletado.</p>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                name="consentimento"
                checked={formData.consentimento}
                onChange={handleChange}
                required
              />
              Sim, concordo em participar
            </label>
          </div>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                name="nao_consentimento"
                checked={false}
                onChange={() => navigate('/')}
              />
              Não desejo participar
            </label>
          </div>
        </section>

        {/* BLOCO 2: IDENTIFICAÇÃO E VÍNCULO */}
        <section className={styles.section}>
          <h2>Identificação e vínculo</h2>

          <div className={styles.field}>
            <label>Setor/área em que trabalha ou trabalhou</label>
            <select name="setor" value={formData.setor} onChange={handleChange} required>
              <option value="">Selecione</option>
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
          {formData.setor === 'outro' && (
            <div className={styles.field}>
              <label>Especifique o setor</label>
              <input type="text" name="setor_outro" value={formData.setor_outro} onChange={handleChange} />
            </div>
          )}

          <div className={styles.field}>
            <label>Cargo formal registrado na carteira</label>
            <select name="cargo_formal" value={formData.cargo_formal} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="operador_telemarketing">Operador de telemarketing</option>
              <option value="atendente_call_center">Atendente de call center</option>
              <option value="assistente_administrativo">Assistente administrativo</option>
              <option value="vendedor">Vendedor</option>
              <option value="consultor_relacionamento">Consultor de relacionamento</option>
              <option value="supervisor">Supervisor</option>
              <option value="analista">Analista</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          {formData.cargo_formal === 'outro' && (
            <div className={styles.field}>
              <label>Especifique o cargo</label>
              <input type="text" name="cargo_formal_outro" value={formData.cargo_formal_outro} onChange={handleChange} />
            </div>
          )}

          <div className={styles.field}>
            <label>Função que efetivamente exerce/exerceu no dia a dia (marque todas que se aplicam)</label>
            <div className={styles.checkboxGroup}>
              {[
                ['atendimento_receptivo', 'Atendimento receptivo'],
                ['vendas', 'Vendas'],
                ['retencao', 'Retenção'],
                ['renovacao', 'Renovação'],
                ['endosso', 'Endosso'],
                ['suporte_tecnico', 'Suporte técnico'],
                ['supervisao', 'Supervisão'],
                ['monitoria', 'Monitoria de qualidade'],
                ['outro', 'Outro'],
              ].map(([valorItem, label]) => (
                <label key={valorItem}>
                  <input
                    type="checkbox"
                    value={valorItem}
                    checked={formData.funcao_efetiva.includes(valorItem)}
                    onChange={handleMultiSelect}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          {formData.funcao_efetiva.includes('outro') && (
            <div className={styles.field}>
              <label>Especifique outra função</label>
              <input type="text" name="funcao_efetiva_outro" value={formData.funcao_efetiva_outro} onChange={handleChange} />
            </div>
          )}

          <div className={styles.field}>
            <label>Situação atual de vínculo</label>
            <select name="situacao_atual" value={formData.situacao_atual} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="ativo">Trabalhador(a) ativo(a)</option>
              <option value="ex_12meses">Ex-funcionário(a), desligado nos últimos 12 meses</option>
              <option value="ex_mais_1ano">Ex-funcionário(a), desligamento há mais de 1 ano</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Em relação à supervisão</label>
            <select name="supervisao" value={formData.supervisao} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sou_fui">Sou ou fui supervisor(a)</option>
              <option value="nunca_fui">Nunca fui supervisor(a)</option>
              <option value="prefiro_nao_responder">Prefiro não responder</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Tempo de empresa</label>
            <select name="tempo_empresa" value={formData.tempo_empresa} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="menos_3_meses">Menos de 3 meses</option>
              <option value="3a6_meses">3 a 6 meses</option>
              <option value="6meses_1ano">6 meses a 1 ano</option>
              <option value="1a2_anos">1 a 2 anos</option>
              <option value="2a5_anos">2 a 5 anos</option>
              <option value="5a10_anos">5 a 10 anos</option>
              <option value="mais_10_anos">Mais de 10 anos</option>
            </select>
          </div>
        </section>

        {/* BLOCO 3: ATIVIDADES E FUNÇÃO */}
        <section className={styles.section}>
          <h2>Atividades e função</h2>

          <div className={styles.field}>
            <label>Você considera que exerce/exerceu atividades típicas de securitário?</label>
            <select name="atividade_securitario" value={formData.atividade_securitario} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="em_partes">Em partes</option>
              <option value="outra_funcao">Realizo outra função (não relacionada a securitário/call center)</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Você considera que exerce ou exerceu atividades que não constam no seu cargo formal?</label>
            <select name="atividade_extra_cargo" value={formData.atividade_extra_cargo} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="em_partes">Em partes</option>
              <option value="nao_sei">Não sei</option>
            </select>
          </div>
          {(formData.atividade_extra_cargo === 'sim' || formData.atividade_extra_cargo === 'em_partes') && (
            <div className={styles.field}>
              <label>Descreva essas atividades</label>
              <textarea name="atividade_extra_cargo_descricao" value={formData.atividade_extra_cargo_descricao} onChange={handleChange} rows="3" />
            </div>
          )}

          <div className={styles.field}>
            <label>Como as metas diárias/mensais são definidas na sua área?</label>
            <select name="metas_definicao" value={formData.metas_definicao} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="unilateral_gestao">São definidas unilateralmente pela gestão</option>
              <option value="participacao_equipe">São definidas com alguma participação da equipe</option>
              <option value="pouco_transparente">São definidas de forma pouco transparente</option>
              <option value="nao_sei">Não sei como são definidas</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Se desejar, descreva brevemente (opcional)</label>
            <textarea name="metas_definicao_descricao" value={formData.metas_definicao_descricao} onChange={handleChange} rows="2" />
          </div>

          <div className={styles.field}>
            <label>Você considera as metas realistas em relação à demanda real de clientes?</label>
            <div className={styles.radioGroup}>
              <span>Nada realistas</span>
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num}>
                  <input
                    type="radio"
                    name="metas_realismo"
                    value={num}
                    checked={formData.metas_realismo === num}
                    onChange={handleChange}
                    required
                  />
                  {num}
                </label>
              ))}
              <span>Totalmente realistas</span>
            </div>
          </div>

          <div className={styles.field}>
            <label>Existe cobrança por resultados que dependem de fatores fora do seu controle?</label>
            <select name="cobranca_fora_controle" value={formData.cobranca_fora_controle} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim_frequentemente">Sim, frequentemente</option>
              <option value="sim_as_vezes">Sim, às vezes</option>
              <option value="nao">Não</option>
              <option value="nao_sei">Não sei</option>
            </select>
          </div>
          {(formData.cobranca_fora_controle === 'sim_frequentemente' || formData.cobranca_fora_controle === 'sim_as_vezes') && (
            <div className={styles.field}>
              <label>Dê exemplos</label>
              <textarea name="cobranca_fora_controle_exemplos" value={formData.cobranca_fora_controle_exemplos} onChange={handleChange} rows="2" />
            </div>
          )}

          <div className={styles.field}>
            <label>As metas costumam vir acompanhadas de pressão de superiores?</label>
            <select name="metas_pressao" value={formData.metas_pressao} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim_frequentemente">Sim, frequentemente</option>
              <option value="sim_as_vezes">Sim, às vezes</option>
              <option value="nao">Não</option>
              <option value="nao_sei">Não sei</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Você considera as cobranças e as próprias metas abusivas?</label>
            <select name="metas_abusivas" value={formData.metas_abusivas} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim_sempre">Sim, sempre</option>
              <option value="sim_alguns_casos">Sim, em alguns casos</option>
              <option value="nao">Não</option>
              <option value="nao_sei">Não sei</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Caso tenha algum caso específico, descreva abaixo (opcional)</label>
            <textarea name="metas_caso_especifico" value={formData.metas_caso_especifico} onChange={handleChange} rows="3" />
          </div>
        </section>

        {/* BLOCO 4: REMUNERAÇÃO */}
        <section className={styles.section}>
          <h2>Remuneração</h2>

          <div className={styles.field}>
            <label>Qual sua remuneração fixa mensal aproximada?</label>
            <select name="remuneracao_faixa" value={formData.remuneracao_faixa} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="ate_1_sm">Até 1 salário mínimo</option>
              <option value="1a2_sm">1 a 2 salários mínimos</option>
              <option value="2a3_sm">2 a 3 salários mínimos</option>
              <option value="3a5_sm">3 a 5 salários mínimos</option>
              <option value="5a10_sm">5 a 10 salários mínimos</option>
              <option value="mais_10_sm">Mais de 10 salários mínimos</option>
              <option value="prefiro_nao_responder">Prefiro não responder</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Quanto recebe em média de bonificações/prêmios mensais?</label>
            <select name="bonificacoes_faixa" value={formData.bonificacoes_faixa} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="nao_recebo">Não recebo bonificações/prêmios</option>
              <option value="ate_10pct">Até 10 por cento da remuneração fixa</option>
              <option value="10a20pct">10 a 20 por cento da remuneração fixa</option>
              <option value="20a30pct">20 a 30 por cento da remuneração fixa</option>
              <option value="30a50pct">30 a 50 por cento da remuneração fixa</option>
              <option value="mais_50pct">Mais de 50 por cento da remuneração fixa</option>
              <option value="nao_sei">Não sei informar</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Você recebe comissão percentual sobre vendas realizadas?</label>
            <select name="recebe_comissao" value={formData.recebe_comissao} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sei">Não sei informar</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Desde que entrou na empresa, suas atribuições aumentaram sem aumento correspondente de salário?</label>
            <select name="aumento_atribuicoes" value={formData.aumento_atribuicoes} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim_muito">Sim, aumentaram muito</option>
              <option value="sim_um_pouco">Sim, aumentaram um pouco</option>
              <option value="nao">Não</option>
              <option value="nao_sei">Não sei</option>
            </select>
          </div>
          {(formData.aumento_atribuicoes === 'sim_muito' || formData.aumento_atribuicoes === 'sim_um_pouco') && (
            <div className={styles.field}>
              <label>Descreva</label>
              <textarea name="aumento_atribuicoes_descricao" value={formData.aumento_atribuicoes_descricao} onChange={handleChange} rows="2" />
            </div>
          )}
        </section>

        {/* BLOCO 5: TREINAMENTO */}
        <section className={styles.section}>
          <h2>Treinamento</h2>

          <div className={styles.field}>
            <label>Quanto tempo durou seu treinamento inicial?</label>
            <select name="treinamento_duracao" value={formData.treinamento_duracao} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="menos_1_semana">Menos de 1 semana</option>
              <option value="1a2_semanas">1 a 2 semanas</option>
              <option value="3a4_semanas">3 a 4 semanas</option>
              <option value="1a2_meses">1 a 2 meses</option>
              <option value="mais_2_meses">Mais de 2 meses</option>
              <option value="nao_houve">Não houve treinamento formal</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>O treinamento preparou adequadamente para as demandas reais?</label>
            <div className={styles.radioGroup}>
              <span>Não preparou nada</span>
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num}>
                  <input
                    type="radio"
                    name="treinamento_preparacao"
                    value={num}
                    checked={formData.treinamento_preparacao === num}
                    onChange={handleChange}
                    required
                  />
                  {num}
                </label>
              ))}
              <span>Preparou completamente</span>
            </div>
          </div>

          <div className={styles.field}>
            <label>Se você é ou foi supervisor(a), recebeu treinamento formal?</label>
            <select name="treinamento_supervisor" value={formData.treinamento_supervisor} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="formal_completo">Recebi treinamento formal completo</option>
              <option value="formal_insuficiente">Recebi treinamento formal insuficiente</option>
              <option value="aprendi_pratica">Aprendi principalmente na prática</option>
              <option value="nao_aplicavel">Não se aplica, nunca fui supervisor</option>
            </select>
          </div>
        </section>

        {/* BLOCO 6: JORNADA, PAUSAS E HORAS EXTRAS */}
        <section className={styles.section}>
          <h2>Jornada, pausas e horas extras</h2>

          <div className={styles.field}>
            <label>As pausas previstas são suficientes para descanso e alimentação na prática?</label>
            <select name="pausas_suficientes" value={formData.pausas_suficientes} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="parcialmente">Parcialmente</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Na prática, qual é a duração total das suas pausas durante a jornada?</label>
            <select name="pausas_duracao" value={formData.pausas_duracao} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="menos_40min">Menos de 40 minutos</option>
              <option value="40min">40 minutos (2 pausas de 10 minutos + 1 pausa de 20 minutos)</option>
              <option value="mais_40min">Mais de 40 minutos</option>
              <option value="sem_pausas_regulares">Não tenho pausas regulares</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Descreva como funciona seu intervalo no dia a dia (opcional)</label>
            <textarea name="pausas_descricao" value={formData.pausas_descricao} onChange={handleChange} rows="2" />
          </div>

          <div className={styles.field}>
            <label>As horas extras realizadas são pagas ou compensadas de forma efetiva?</label>
            <select name="horas_extras_pagas" value={formData.horas_extras_pagas} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sempre">Sempre</option>
              <option value="as_vezes">Às vezes</option>
              <option value="nunca">Nunca</option>
              <option value="nao_realizo">Não realizo horas extras</option>
              <option value="nao_sei">Não sei informar</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Você já teve horas extras não devidamente compensadas?</label>
            <select name="horas_extras_nao_compensadas" value={formData.horas_extras_nao_compensadas} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sei">Não sei</option>
            </select>
          </div>
          {formData.horas_extras_nao_compensadas === 'sim' && (
            <div className={styles.field}>
              <label>Relate a situação</label>
              <textarea name="horas_extras_relato" value={formData.horas_extras_relato} onChange={handleChange} rows="3" />
            </div>
          )}
        </section>

        {/* BLOCO 7: MONITORIA E AVALIAÇÃO */}
        <section className={styles.section}>
          <h2>Monitoria e avaliação</h2>

          <div className={styles.field}>
            <label>Como funciona a avaliação/monitoramento das suas ligações?</label>
            <select name="monitoramento_tipo" value={formData.monitoramento_tipo} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="nao_ha">Não há monitoramento</option>
              <option value="automatico_amostragem">Monitoramento automático por amostragem</option>
              <option value="individual_feedback">Monitoramento individual com feedback</option>
              <option value="nao_sei">Não sei</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          {formData.monitoramento_tipo === 'outro' && (
            <div className={styles.field}>
              <label>Especifique</label>
              <input type="text" name="monitoramento_outro" value={formData.monitoramento_outro} onChange={handleChange} />
            </div>
          )}

          <div className={styles.field}>
            <label>Você considera a CX/monitoria uma ferramenta educativa ou punitiva?</label>
            <div className={styles.radioGroup}>
              <span>Totalmente punitiva</span>
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num}>
                  <input
                    type="radio"
                    name="cx_avaliacao"
                    value={num}
                    checked={formData.cx_avaliacao === num}
                    onChange={handleChange}
                    required
                  />
                  {num}
                </label>
              ))}
              <span>Totalmente educativa</span>
            </div>
          </div>

          <div className={styles.field}>
            <label>Já teve remuneração ou benefícios afetados por resultado de monitoria?</label>
            <select name="remuneracao_afetada_monitoria" value={formData.remuneracao_afetada_monitoria} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim_mais_uma_vez">Sim, mais de uma vez</option>
              <option value="sim_uma_vez">Sim, uma vez</option>
              <option value="nao">Não</option>
              <option value="nao_sei">Não sei</option>
            </select>
          </div>
          {(formData.remuneracao_afetada_monitoria === 'sim_mais_uma_vez' || formData.remuneracao_afetada_monitoria === 'sim_uma_vez') && (
            <div className={styles.field}>
              <label>Descreva</label>
              <textarea name="remuneracao_monitoria_descricao" value={formData.remuneracao_monitoria_descricao} onChange={handleChange} rows="2" />
            </div>
          )}
        </section>

        {/* BLOCO 8: SAÚDE MENTAL E ADOECIMENTO */}
        <section className={styles.section}>
          <h2>Saúde mental e adoecimento</h2>

          <div className={styles.field}>
            <label>Você já precisou se afastar do trabalho por motivos de saúde mental?</label>
            <select name="afastamento_saude_mental" value={formData.afastamento_saude_mental} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="prefiro_nao_responder">Prefiro não responder</option>
            </select>
          </div>

          {formData.afastamento_saude_mental === 'sim' && (
            <>
              <div className={styles.field}>
                <label>Por quanto tempo ficou afastado?</label>
                <select name="afastamento_duracao" value={formData.afastamento_duracao} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="menos_1_mes">Menos de 1 mês</option>
                  <option value="1a3_meses">1 a 3 meses</option>
                  <option value="3a6_meses">3 a 6 meses</option>
                  <option value="mais_6_meses">Mais de 6 meses</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Como foi o retorno da empresa?</label>
                <select name="afastamento_retorno" value={formData.afastamento_retorno} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="adequado">Adequado</option>
                  <option value="parcialmente_adequado">Parcialmente adequado</option>
                  <option value="inadequado">Inadequado</option>
                  <option value="nao_aplicavel">Não se aplica</option>
                  <option value="prefiro_nao_responder">Prefiro não responder</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Descreva detalhes se desejar (opcional)</label>
                <textarea name="afastamento_detalhes" value={formData.afastamento_detalhes} onChange={handleChange} rows="2" />
              </div>
            </>
          )}

          <div className={styles.field}>
            <label>Você percebe relação entre a pressão do trabalho e adoecimento de colegas?</label>
            <select name="relacao_pressao_adoecimento" value={formData.relacao_pressao_adoecimento} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim_forte">Sim, forte</option>
              <option value="sim_moderada">Sim, moderada</option>
              <option value="nao">Não</option>
              <option value="nao_sei">Não sei</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Dê exemplos, se possível sem citar nomes (opcional)</label>
            <textarea name="relacao_pressao_exemplos" value={formData.relacao_pressao_exemplos} onChange={handleChange} rows="2" />
          </div>

          <div className={styles.field}>
            <label>Você já presenciou ou vivenciou humilhação, sobrecarga proposital ou pressão excessiva?</label>
            <select name="humilhacao" value={formData.humilhacao} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim_presenciei">Sim, já presenciei</option>
              <option value="sim_vivenciei">Sim, já vivenciei</option>
              <option value="sim_ambos">Sim, ambos</option>
              <option value="nao">Não</option>
              <option value="prefiro_nao_responder">Prefiro não responder</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Descreva, se desejar (opcional)</label>
            <textarea name="humilhacao_descricao" value={formData.humilhacao_descricao} onChange={handleChange} rows="3" />
          </div>
        </section>

        {/* BLOCO 9: ROTATIVIDADE E DESLIGAMENTO */}
        <section className={styles.section}>
          <h2>Rotatividade e desligamento</h2>

          <div className={styles.field}>
            <label>Você percebe alta rotatividade na sua equipe/setor?</label>
            <select name="rotatividade" value={formData.rotatividade} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sei">Não sei dizer</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Já presenciou ou sofreu pressão para pedir desligamento voluntário?</label>
            <select name="pressao_desligamento" value={formData.pressao_desligamento} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim_sofri">Sim, sofri</option>
              <option value="sim_presenciei">Sim, presenciei colegas</option>
              <option value="sim_ambos">Sim, ambos</option>
              <option value="nao">Não</option>
              <option value="prefiro_nao_responder">Prefiro não responder</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Já viu casos de demissão por justa causa que considerou injustificada?</label>
            <select name="justa_causa_injustificada" value={formData.justa_causa_injustificada} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sei">Não sei</option>
              <option value="prefiro_nao_responder">Prefiro não responder</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Descreva, se desejar (opcional)</label>
            <textarea name="desligamento_descricao" value={formData.desligamento_descricao} onChange={handleChange} rows="2" />
          </div>

          <div className={styles.field}>
            <label>Conhece casos de colegas que entraram na Justiça contra a empresa durante o vínculo?</label>
            <select name="casos_justica" value={formData.casos_justica} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim_conheco">Sim, conheço</option>
              <option value="nao_conheco">Não conheço</option>
              <option value="nao_sei">Não sei</option>
              <option value="prefiro_nao_responder">Prefiro não responder</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Se desejar, descreva (opcional)</label>
            <textarea name="casos_justica_descricao" value={formData.casos_justica_descricao} onChange={handleChange} rows="2" />
          </div>
        </section>

        {/* BLOCO 10: DIVERSIDADE E DISCRIMINAÇÃO */}
        <section className={styles.section}>
          <h2>Diversidade e discriminação</h2>

          <div className={styles.field}>
            <label>Você percebe desigualdade de representação entre cargos operacionais e liderança?</label>
            <select name="desigualdade_representacao" value={formData.desigualdade_representacao} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="nao_percebo">Não percebo</option>
              <option value="percebo_parcialmente">Percebo parcialmente</option>
              <option value="percebo_fortemente">Percebo fortemente</option>
              <option value="nao_sei">Não sei informar</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Se desejar, descreva (opcional)</label>
            <textarea name="desigualdade_descricao" value={formData.desigualdade_descricao} onChange={handleChange} rows="2" />
          </div>

          <div className={styles.field}>
            <label>Já presenciou ou sofreu situações de racismo, assédio ou discriminação?</label>
            <select name="racismo_assédio" value={formData.racismo_assédio} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim_sofri">Sim, sofri</option>
              <option value="sim_presenciei">Sim, presenciei</option>
              <option value="sim_ambos">Sim, ambos</option>
              <option value="nao">Não</option>
              <option value="prefiro_nao_responder">Prefiro não responder</option>
            </select>
          </div>

          {formData.racismo_assédio && formData.racismo_assédio !== 'nao' && formData.racismo_assédio !== 'prefiro_nao_responder' && (
            <>
              <div className={styles.field}>
                <label>Como a empresa respondeu?</label>
                <select name="empresa_resposta" value={formData.empresa_resposta} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="nao_respondeu">Não respondeu</option>
                  <option value="inadequada">Respondeu de forma inadequada</option>
                  <option value="parcialmente">Respondeu parcialmente</option>
                  <option value="adequadamente">Respondeu adequadamente</option>
                  <option value="nao_sei">Não sei</option>
                  <option value="nao_aplicavel">Não se aplica</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Descreva, se desejar (opcional)</label>
                <textarea name="discriminacao_descricao" value={formData.discriminacao_descricao} onChange={handleChange} rows="2" />
              </div>
            </>
          )}

          <div className={styles.field}>
            <label>Conhecimento de práticas de favorecimento (nepotismo) em promoções?</label>
            <select name="nepotismo" value={formData.nepotismo} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
              <option value="nao_sei">Não sei</option>
              <option value="prefiro_nao_responder">Prefiro não responder</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Se desejar, descreva (opcional)</label>
            <textarea name="nepotismo_descricao" value={formData.nepotismo_descricao} onChange={handleChange} rows="2" />
          </div>
        </section>

        {/* BLOCO 11: CAMPO FINAL */}
        <section className={styles.section}>
          <h2>Campo final</h2>
          <div className={styles.field}>
            <label>Espaço aberto para relatos, complementos e observações (opcional)</label>
            <textarea
              name="observacoes_finais"
              value={formData.observacoes_finais}
              onChange={handleChange}
              rows="6"
              placeholder="Este é um espaço livre para você acrescentar qualquer informação que considere relevante sobre suas condições de trabalho."
            />
          </div>
        </section>

        {/* CAPTCHA */}
        <section className={styles.section}>
          <h2>Confirmação de segurança</h2>
          <div className={styles.field}>
            <p className={styles.intro} style={{ textAlign: 'left', marginBottom: '12px' }}>
              Para evitar envios automatizados, confirme que você não é um robô.
            </p>
            <HCaptcha
              sitekey={import.meta.env.VITE_HCAPTCHA_SITEKEY}
              onVerify={(token) => setCaptchaToken(token)}
              theme="dark"
              ref={captchaRef}
            />
          </div>
        </section>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span className={styles.buttonSpinner} aria-hidden="true"></span>
              Enviando...
            </>
          ) : (
            'Enviar resposta'
          )}
        </button>
      </form>
    </div>
  );
};

export default FormularioPublico;