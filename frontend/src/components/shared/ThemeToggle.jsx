import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
  const { tema, toggleTema } = useTheme();

  return (
    <button
      className={styles.toggle}
      onClick={toggleTema}
      aria-label="Alternar modo de contraste"
      title={tema === 'padrao' ? 'Mudar para Alto Contraste' : 'Mudar para Modo Padrão'}
    >
      {tema === 'padrao' ? 'Alto Contraste' : 'Modo Padrão'}
    </button>
  );
};

export default ThemeToggle;