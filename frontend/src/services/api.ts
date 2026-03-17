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

// 2. Interceptor de RESPONSE (A Volta - O Guarda-costas do 401)
api.interceptors.response.use(
  (response) => {
    return response; // Se deu 200 (Sucesso), segue o jogo
  },
  (error) => {
    // Se o erro for 401 (Não Autorizado / Token Vencido)
    if (error.response && error.response.status === 401) {
      console.warn("Token inválido ou expirado. Deslogando...");
      
      // Limpa os dados velhos
      localStorage.removeItem('@AppFinancas:token');
      localStorage.removeItem('@AppFinancas:user');
      
      // Manda pro login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;