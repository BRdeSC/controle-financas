import { useState } from 'react';
import api from '../services/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('@AppFinancas:token', token);
      localStorage.setItem('@AppFinancas:user', JSON.stringify(user));

      alert(`Olá ${user.name}, login realizado!`);
      // Redireciona para a home/dashboard
      window.location.href = '/'; 
    } catch (err: any) {
      alert('Erro no login: ' + (err.response?.data?.error || 'Tente novamente'));
    }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin}>
        <h2>Acessar Minhas Contas</h2>
        <input type="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
        <p>Não tem conta? <a href="/register">Cadastre-se</a></p>
      </form>
    </div>
  );
}
