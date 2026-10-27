import api from './axios';

export const enviarPesquisa = (data) => {
  return api.post('/pesquisa/criar/', data);
};

export const listarPesquisas = (params) => {
  return api.get('/pesquisa/listar/', { params });
};

export const getResumoPesquisas = () => {
  return api.get('/pesquisa/resumo/');
};

export const exportarPesquisasCSV = (params) => {
  return api.get('/pesquisa/exportar/', {
    params,
    responseType: 'blob',
  });
};