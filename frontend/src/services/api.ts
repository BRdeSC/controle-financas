// frontend/src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  // Esta é a URL onde o nosso Node.js está a rodar!
  baseURL: 'http://localhost:3333', 
});
