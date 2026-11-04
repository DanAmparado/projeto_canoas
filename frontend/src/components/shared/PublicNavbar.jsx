import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import styles from './PublicNavbar.module.css';

const PublicNavbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftLinks}>
        <Link to="/" className={isActive('/') ? styles.active : ''}>
          Início
        </Link>
        <Link to="/manifesto" className={isActive('/manifesto') ? styles.active : ''}>
          Manifesto
        </Link>
        <Link to="/formulario" className={isActive('/formulario') ? styles.active : ''}>
          Enviar mensagem
        </Link>
      </div>
      <div className={styles.rightSection}>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default PublicNavbar;