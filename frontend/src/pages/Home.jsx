import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Bem-vindo ao nosso formulário</h1>
        <p className={styles.subtitle}>
          Este é um espaço para você enviar sua mensagem de forma simples e segura.
        </p>
      </header>

      <section className={styles.blocoPrincipal}>
        <div className={styles.caixaTitulo}>
          <h1>Como funciona</h1>
        </div>
        <div className={styles.caixaCorpo}>
          <p>
            Preencha o formulário com seu nome, e-mail (opcional) e a sua mensagem.
            As respostas são armazenadas em nosso banco de dados de forma segura.
          </p>
          <p>
            A equipe administrativa poderá visualizar as respostas em um painel
            restrito e exportar os dados em formato CSV quando necessário.
          </p>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.caixaTitulo}>
          <h2>Pronto para enviar?</h2>
        </div>
        <div className={styles.ctaBox}>
          <Link to="/formulario" className={styles.btnPrimary}>
            Ir para o formulário
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Seus dados estão seguros.</p>
        <Link to="/gestao/login" className={styles.adminLink}>
          Área restrita
        </Link>
      </footer>
    </div>
  );
};

export default Home;