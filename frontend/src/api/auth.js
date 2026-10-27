import api from './axios';

export const login = (username, password) => {
  return api.post('/token/', { username, password });
};

export const getProfile = () => {
  return api.get('/accounts/me/');
};