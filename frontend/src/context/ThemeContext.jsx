import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [tema, setTema] = useState(() => {
    const salvo = localStorage.getItem('tema');
    return salvo || 'padrao'; // 'padrao' ou 'alto-contraste'
  });

  useEffect(() => {
    localStorage.setItem('tema', tema);
    if (tema === 'alto-contraste') {
      document.documentElement.classList.add('alto-contraste');
    } else {
      document.documentElement.classList.remove('alto-contraste');
    }
  }, [tema]);

  const toggleTema = () => {
    setTema((prev) => (prev === 'padrao' ? 'alto-contraste' : 'padrao'));
  };

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};