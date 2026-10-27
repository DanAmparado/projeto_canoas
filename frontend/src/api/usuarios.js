import api from './axios';

export const listarUsuarios = () => {
  return api.get('/accounts/usuarios/');
};

export const criarUsuario = (data) => {
  return api.post('/accounts/usuarios/', data);
};

export const atualizarUsuario = (id, data) => {
  return api.put(`/accounts/usuarios/${id}/`, data);
};

export const deletarUsuario = (id) => {
  return api.delete(`/accounts/usuarios/${id}/`);
};