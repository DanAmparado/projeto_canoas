import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Home.module.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      {/* Banner */}
      <header className={styles.header}>
        <img
          src="/banner.png"
          alt="Fachada da Brasilseg em Franca"
          className={styles.bannerImage}
        />
      </header>

      {/* Seção principal: caixa amarela de título + corpo preto */}
      <section className={styles.blocoPrincipal}>
        <div className={styles.caixaTitulo}>
          <h1>Sua voz constrói o retrato coletivo</h1>
        </div>
        <div className={styles.caixaCorpo}>
          <p>
            Este formulário é uma iniciativa para coletar relatos de trabalhadoras e trabalhadores
            (atuais ou ex-funcionários) da Central de Relacionamento e Negócios da Brasilseg em Franca (SP),
            dando continuidade à apuração já publicada e apoiando a organização e mobilização coletiva
            da categoria.
          </p>
          <p>
            O formulário é <strong>totalmente anônimo</strong>. Nenhum dado de identificação é coletado.
            As respostas serão tratadas de forma agregada, para denúncia coletiva e organização dos trabalhadores.
          </p>
        </div>
      </section>

      {/* Seção: por que participar */}
      <section className={styles.blocoSecundario}>
        <div className={styles.caixaTitulo}>
          <h2>Denunciar não é gesto isolado</h2>
        </div>
        <div className={styles.caixaCorpo}>
          <p>
            É o que transforma experiências individuais de sobrecarga e adoecimento, muitas vezes
            vividas em silêncio, em um retrato coletivo capaz de pressionar por mudança real.
          </p>
          <p>
            Enquanto casos ficam dispersos, a empresa segue tratando a precarização como custo normal
            do negócio. Quando os relatos se somam, eles viram base concreta para organização dos
            trabalhadores e reivindicação sindical.
          </p>
        </div>
      </section>

      {/* Chamada para ação */}
      <section className={styles.ctaSection}>
        <div className={styles.caixaTitulo}>
          <h2>Participe agora</h2>
        </div>
        <div className={styles.ctaBox}>
          <Link to="/formulario" className={styles.btnPrimary}>
            Enviar denúncia anônima
          </Link>
          <Link to="/manifesto" className={styles.btnSecondary}>
            Ler o manifesto completo
          </Link>
        </div>
      </section>

      {/* Rodapé */}
      <footer className={styles.footer}>
        <p>Suas respostas são anônimas e confidenciais.</p>
        <Link to="/gestao/login" className={styles.adminLink}>
          Área restrita
        </Link>
      </footer>
    </div>
  );
};

export default Home;