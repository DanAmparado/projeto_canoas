import api from './axios';

export const enviarResposta = (data) => {
  return api.post('/respostas/criar/', data);
};

export const listarRespostas = (params) => {
  return api.get('/respostas/listar/', { params });
};

export const getResumoRespostas = () => {
  return api.get('/respostas/resumo/');
};

export const exportarRespostasCSV = (params) => {
  return api.get('/respostas/exportar/', {
    params,
    responseType: 'blob',
  });
};