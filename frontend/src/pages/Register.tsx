import { useState } from 'react';
import api from '../services/api';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      alert('Cadastro realizado com sucesso! Agora faça o login.');
      window.location.href = '/login';
    } catch (err: any) {
      alert('Erro ao cadastrar: ' + (err.response?.data?.error || 'Tente novamente'));
    }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px'  }}>
        <h2>Criar Conta</h2>
        <input type="text" placeholder="Nome" onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} required />
        <button style={{marginTop: '20px'}} type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
