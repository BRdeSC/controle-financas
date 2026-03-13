import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

// Esse trecho abaixo é "mágico": ele tenta pegar o token do navegador 
// e colocar em todas as requisições automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@AppFinancas:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;