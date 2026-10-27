import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, title, message, children, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar' }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>{title}</h3>
        {children ? (
          <div className={styles.modalContent}>{children}</div>
        ) : (
          message && <p>{message}</p>
        )}
        <div className={styles.actions}>
          {onCancel && (
            <button className={styles.cancelButton} onClick={onCancel}>{cancelText}</button>
          )}
          {onConfirm && (
            <button className={styles.confirmButton} onClick={onConfirm}>{confirmText}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;