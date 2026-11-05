import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { enviarResposta } from '../api/respostas';
import styles from './FormularioPublico.module.css';

const DRAFT_KEY = 'rascunho_assinatura';

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
    nome: '',
    telefone: '',
    email: '',
    mensagem: '',
  };

  const [formData, setFormData] = useState(estadoInicial);

  // Restaura rascunho
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.nome || parsed.telefone)) {
          setFormData((prev) => ({ ...prev, ...parsed }));
          setDraftRestored(true);
        }
      }
    } catch (err) {}
  }, []);

  // Salva rascunho
  useEffect(() => {
    try {
      if (loading || success) return;
      const temConteudo = formData.nome || formData.telefone;
      if (!temConteudo) return;
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch (err) {}
  }, [formData, loading, success]);

  // Aviso ao sair
  useEffect(() => {
    const handler = (e) => {
      if (loading || success) return;
      const temConteudo = formData.nome || formData.telefone;
      if (temConteudo) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [formData, loading, success]);

  const limparRascunho = () => {
    localStorage.removeItem(DRAFT_KEY);
    setFormData(estadoInicial);
    setDraftRestored(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.telefone.trim()) {
      setError('Nome e Telefone são obrigatórios para assinar.');
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
      await enviarResposta(dadosComCaptcha);
      localStorage.removeItem(DRAFT_KEY);
      setSuccess(true);
      setFormData(estadoInicial);
      setCaptchaToken('');
      captchaRef.current?.resetCaptcha();
      setTimeout(() => navigate('/obrigado'), 2000);
    } catch (err) {
      setError('Erro ao assinar. Tente novamente.');
      captchaRef.current?.resetCaptcha();
      setCaptchaToken('');
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
                <p className={styles.overlayText}>Isso pode levar até 1 minuto. Aguarde, por favor.</p>
              </>
            ) : (
              <>
                <h2 className={styles.overlayTitle}>Registrando sua assinatura...</h2>
                <p className={styles.overlayText}>Aguarde um instante.</p>
              </>
            )}
          </div>
        </div>
      )}

      <h1 className={styles.title}>Abaixo-Assinado</h1>
      <p className={styles.intro}>
        Em defesa do Rio Canoas e contra a privatização! Deixe seus dados para nos ajudar a organizar a mobilização e te avisar sobre as votações.
      </p>
      
      {draftRestored && (
        <div className={styles.draftNotice}>
          <span>Rascunho restaurado automaticamente.</span>
          <button type="button" onClick={limparRascunho} className={styles.draftClear}>
            Limpar
          </button>
        </div>
      )}

      {success && <div className={styles.success}>Sua assinatura foi registrada! Muito obrigado.</div>}
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.section}>
          <h2>Seus dados</h2>
          
          <div className={styles.field}>
            <label>Nome completo *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Telefone / WhatsApp *</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(16) 99999-9999"
              required
            />
          </div>

          <div className={styles.field}>
            <label>E-mail (opcional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2>Deixe uma mensagem (opcional)</h2>
          <div className={styles.field}>
            <label>Por que você defende o Rio Canoas?</label>
            <textarea
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              rows="4"
              placeholder="Escreva aqui se desejar..."
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2>Confirmação de segurança</h2>
          <div className={styles.field}>
            <p className={styles.intro} style={{ textAlign: 'left', marginBottom: '12px' }}>
              Para evitar robôs, confirme abaixo:
            </p>
            <HCaptcha
              sitekey={import.meta.env.VITE_HCAPTCHA_SITEKEY}
              onVerify={(token) => setCaptchaToken(token)}
              theme="dark"
              ref={captchaRef}
            />
          </div>
        </section>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Assinando...' : 'Assinar o abaixo-assinado'}
        </button>
      </form>
    </div>
  );
};

export default FormularioPublico;