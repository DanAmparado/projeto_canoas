import React from 'react';
import styles from './Alert.module.css';

const Alert = ({ type = 'success', message, onClose }) => {
  if (!message) return null;

  const alertClass = type === 'success' ? styles.success : styles.error;

  return (
    <div className={`${styles.alert} ${alertClass}`}>
      <span>{message}</span>
      {onClose && (
        <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;