import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>EM DEFESA DO RIO CANOAS</h1>
        <p className={styles.subtitle}>
          Contra a privatização da nossa água e pela organização da classe trabalhadora.
        </p>
      </header>

      <section className={styles.blocoPrincipal}>
        <div className={styles.caixaTitulo}>
          <h1>O futuro da água de Franca está em jogo</h1>
        </div>
        <div className={styles.caixaCorpo}>
          <p>
            O Projeto de Lei Complementar 11/2026 pretende privatizar a Macrozona do Rio Canoas,
            ameaçando o abastecimento de cerca de 150 mil moradores.
          </p>
          <p>
            Precisamos nos organizar para defender o Rio Canoas e garantir água de qualidade
            para toda a população.
          </p>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.caixaTitulo}>
          <h2>Participe da mobilização</h2>
        </div>
        <div className={styles.ctaBox}>
          <Link to="/manifesto" className={styles.btnSecondary}>
            Leia a nota política completa
          </Link>
          <Link to="/formulario" className={styles.btnPrimary}>
            Assinar
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Defender o Canoas é defender a vida.</p>
        <Link to="/gestao/login" className={styles.adminLink}>
          Área restrita
        </Link>
      </footer>
    </div>
  );
};

export default Home;