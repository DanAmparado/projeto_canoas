import api from './axios';

export const listarUnidades = () => {
  return api.get('/atendimentos/unidades/'); // listagem pública
};

export const listarUnidadesAdmin = () => {
  return api.get('/atendimentos/unidades/admin/'); // listagem completa (admin)
};

export const criarUnidade = (data) => {
  return api.post('/atendimentos/unidades/admin/', data);
};

export const atualizarUnidade = (id, data) => {
  return api.put(`/atendimentos/unidades/admin/${id}/`, data);
};

export const deletarUnidade = (id) => {
  return api.delete(`/atendimentos/unidades/admin/${id}/`);
};