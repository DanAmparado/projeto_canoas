import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Obrigado.module.css';

const Obrigado = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.tituloBox}>
          <h1>Assinatura Registrada!</h1>
        </div>
        
        <div className={styles.corpoBox}>
          <p className={styles.message}>
            Muito obrigado por assinar o abaixo-assinado em defesa do Rio Canoas.
            Sua voz é fundamental para barrarmos a privatização da nossa água.
          </p>
          <p className={styles.message}>
            Nós guardamos seu contato para te avisar sobre as próximas mobilizações, audiências públicas e o dia da votação na Câmara.
          </p>
          <p className={styles.highlight}>
            Fique de olho no seu WhatsApp!
          </p>
        </div>

        <div className={styles.buttons}>
          <Link to="/manifesto" className={styles.btnPrimary}>
            Ler a nota política completa
          </Link>
          <Link to="/" className={styles.btnSecondary}>
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Obrigado;