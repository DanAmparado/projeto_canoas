import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/gestao/login', { replace: true });
  };

  if (!user) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftLinks}>
        <Link to="/gestao/dashboard">Dashboard</Link>
        <Link to="/gestao/listagem">Listar Respostas</Link>
        {user.role === 'admin' && (
          <Link to="/gestao/usuarios">Gerenciar Usuários</Link>
        )}
        <Link to="/manifesto">Manifesto</Link>
        <Link to="/">Site público</Link>
      </div>
      <div className={styles.rightSection}>
        <span className={styles.userInfo}>
          {user.username} <span className={styles.role}>{user.role}</span>
        </span>
        <ThemeToggle />
        <button className={styles.logoutButton} onClick={handleLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
};

export default Navbar;