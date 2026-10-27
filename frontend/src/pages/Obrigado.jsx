import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Obrigado.module.css';

const Obrigado = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.tituloBox}>
          <h1>Denúncia registrada</h1>
        </div>

        <div className={styles.corpoBox}>
          <p className={styles.message}>
            Sua denúncia foi enviada com sucesso. Cada relato é fundamental para construir
            um retrato coletivo das condições de trabalho e fortalecer a organização dos
            trabalhadores e trabalhadoras.
          </p>
          <p className={styles.message}>
            Sua identidade permanece totalmente anônima. Nenhum dado pessoal foi coletado.
          </p>
        </div>

        <div className={styles.buttons}>
          <Link to="/manifesto" className={styles.btnPrimary}>
            Ler o manifesto
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