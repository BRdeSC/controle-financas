import { useEffect, useState, FormEvent } from 'react';
import api from '../services/api';
import type { Transaction } from './types/Transaction';
import '../App.css';

function Dashboard() {
  // 1. ESTADOS (Definidos no topo para evitar erros de inicialização)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Estados do Formulário
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [editingId, setEditingId] = useState<string | null>(null);

  const userJson = localStorage.getItem('@AppFinancas:user');
  const user = userJson ? JSON.parse(userJson) : null;

  // 2. FUNÇÃO DE CARREGAMENTO (Fonte da verdade: Banco de Dados)
  async function loadTransactions() {
    try {
      console.log(`Buscando dados para: ${selectedMonth}/${selectedYear}`);
      const response = await api.get(`/transactions/filter?month=${selectedMonth}&year=${selectedYear}`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao buscar contas filtradas:", error);
    }
  }

  // 3. EFEITO COLATERAL (Gatilho para mudar o mês/ano)
  useEffect(() => {
    loadTransactions();
  }, [selectedMonth, selectedYear]);

  // 4. FUNÇÕES DE MANIPULAÇÃO
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      const payload = {
        description,
        amount: Number(amount),
        type,
        dueDate: new Date(dueDate).toISOString(),
      };

      if (editingId) {
        const response = await api.put(`/transactions/${editingId}`, payload);
        // Atualiza a lista localmente mantendo a ordem
        setTransactions(transactions.map(t => t.id === editingId ? response.data : t));
        setEditingId(null); 
      } else {
        await api.post('/transactions', { ...payload, status: 'pending' });
        // RECARREGA do banco para garantir que a nova conta respeita o filtro atual
        loadTransactions();
      }

      // Limpa o formulário
      setDescription(''); setAmount(''); setDueDate(''); setType('expense');
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar a conta.");
    }
  }

  function handleLogout() {
    localStorage.removeItem('@AppFinancas:token');
    localStorage.removeItem('@AppFinancas:user');
    window.location.href = '/login';
  }

  function handleEditClick(conta: Transaction) {
    setDescription(conta.description);
    setAmount(String(conta.amount));
    setDueDate(conta.dueDate.split('T')[0]); 
    setType(conta.type);
    setEditingId(conta.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setDescription(''); setAmount(''); setDueDate(''); setType('expense');
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    const confirmacao = window.confirm("Tem certeza que deseja apagar esta conta?");
    if (confirmacao) {
      try {
        await api.delete(`/transactions/${id}`);
        setTransactions(transactions.filter(t => t.id !== id));
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  }

  async function handleToggleStatus(id: string, currentStatus: 'pending' | 'paid') {
    try {
      const newStatus = currentStatus === 'pending' ? 'paid' : 'pending';
      const response = await api.put(`/transactions/${id}`, { status: newStatus });
      setTransactions(transactions.map(conta => conta.id === id ? response.data : conta));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao alterar o status da conta.");
    }
  }

  function handleLogout() {
    localStorage.removeItem('@AppFinancas:token');
    localStorage.removeItem('@AppFinancas:user');
    window.location.href = '/login';
  }

  // --- CÁLCULOS DO DASHBOARD (Baseados no que o filtro retornou) ---
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const expenses = sortedTransactions.filter(t => t.type === 'expense');
  const incomes = sortedTransactions.filter(t => t.type === 'income');

  const totalReceitas = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const despesasPagas = expenses.filter(t => t.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const todasDespesas = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  
  const saldoAtual = totalReceitas - despesasPagas; 
  const saldoProjetado = totalReceitas - todasDespesas;

  const isExpense = type === 'expense';
  const tituloFormulario = editingId ? `✏️ Editar ${isExpense ? 'Conta' : 'Receita'}` : `Adicionar Nova ${isExpense ? 'Conta' : 'Receita'}`;
  const placeholderDescricao = isExpense ? 'Digite o nome da conta (ex: Casa, Luz)' : 'Digite o nome da receita (ex: Salário, Vendas)';
  const textoBotao = editingId ? 'Salvar Alterações' : `Adicionar ${isExpense ? 'Conta' : 'Receita'}`;

  const userStorage = localStorage.getItem('@AppFinancas:user');

  // --- RENDERIZAÇÃO DE ITENS ---
  const renderItem = (conta: Transaction) => (
    <li key={conta.id} style={{ 
      borderBottom: '1px solid #ccc', padding: '12px', 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: conta.type === 'expense' && conta.status === 'paid' ? '#f0fff0' : '#ffffff', color: '#222'
    }}>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
        <strong style={{ minWidth: '130px', color: '#000' }}>{conta.description}</strong> 
        <span style={{ color: '#888' }}>-</span>
        <span style={{ minWidth: '90px', color: '#444' }}>
          {new Date(conta.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
        </span>
        <span style={{ color: '#888' }}>-</span>
        <span style={{ minWidth: '100px', color: conta.type === 'expense' ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>
          R$ {conta.amount.toFixed(2)}
        </span>
        
        {conta.type === 'expense' && (
          <>
            <span style={{ color: '#888' }}>-</span>
            <span style={{ minWidth: '100px', color: conta.status === 'paid' ? '#28a745' : '#ffc107', fontWeight: 'bold' }}>
              {conta.status === 'paid' ? '✅ Pago' : '⏳ Pendente'}
            </span>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '5px' }}>
        <button onClick={() => handleEditClick(conta)} style={{ padding: '6px', background: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }} title="Editar">✏️</button>
        <button onClick={() => handleDelete(conta.id)} style={{ padding: '6px', background: '#dc3545', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white' }} title="Excluir">🗑️</button>
        {conta.type === 'expense' && (
          <button 
            onClick={() => handleToggleStatus(conta.id, conta.status)}
            style={{ padding: '6px 12px', background: conta.status === 'pending' ? '#28a745' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', minWidth: '85px' }}
          >
            {conta.status === 'pending' ? 'Paga' : 'Desfazer'}
          </button>
        )}
      </div>
    </li>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif', color: '#222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h2 style={{ color: '#fff', margin: 0 }}>
        💰 Painel de contas
      </h2>
      <h2 style={{ textAlign: 'center', color: '#fff' }}>
        Usuário: {user ? user.name : 'Minhas'}
      </h2>
    </div>

      {/* SELETOR DE MÊS E ANO */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', gap: '20px', 
        marginBottom: '20px', padding: '10px', background: '#333', borderRadius: '8px', height: '40px' 
      }}>
        <div style={{ display: 'flex', gap: '10px' }}>

          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <option value={2025}>2020</option>
            <option value={2025}>2021</option>
            <option value={2025}>2022</option>
            <option value={2025}>2023</option>
            <option value={2025}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>

          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            style={{ padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <option value={1}>Janeiro</option>
            <option value={2}>Fevereiro</option>
            <option value={3}>Março</option>
            <option value={4}>Abril</option>
            <option value={5}>Maio</option>
            <option value={6}>Junho</option>
            <option value={7}>Julho</option>
            <option value={8}>Agosto</option>
            <option value={9}>Setembro</option>
            <option value={10}>Outubro</option>
            <option value={11}>Novembro</option>
            <option value={12}>Dezembro</option>
          </select>
        </div>

        <div>
          <button onClick={handleLogout} style={{ float: 'right', background: '#333', color: '#fff' }}>
            Sair
          </button>
        </div>
      </div>
      
      {/* Formulário */}
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', flexDirection: 'column', gap: '10px', 
        padding: '20px', background: editingId ? '#fff3cd' : '#f5f5f5', 
        border: editingId ? '2px solid #ffc107' : 'none', borderRadius: '8px', marginBottom: '20px' 
      }}>
        <h3>{tituloFormulario}</h3>

        <select 
          value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: '#222', background: '#fff' }}
        >
          <option value="expense">🔴 Despesa (A pagar)</option>
          <option value="income">🟢 Receita (Salário, etc)</option>
        </select>

        <input 
          type="text" placeholder={placeholderDescricao} value={description}
          onChange={(e) => setDescription(e.target.value)} required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: '#222', background: '#fff' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" step="0.01" placeholder="Valor (R$)" value={amount}
            onChange={(e) => setAmount(e.target.value)} required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1, color: '#222', background: '#fff' }}
          />
          <input 
            type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1, color: '#222', background: '#fff' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 1, padding: '10px', background: editingId ? '#ffc107' : '#007bff', color: editingId ? '#000' : 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {textoBotao}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* BLOCO DE RECEITAS */}
      <div style={{ background: '#eafaf1', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#28a745', margin: '0 0 10px 0' }}>🟢 Receitas</h2>
        {incomes.length === 0 ? <p style={{ color: '#666', margin: 0 }}>Nenhuma receita cadastrada.</p> : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {incomes.map(renderItem)}
          </ul>
        )}
      </div>

      {/* BLOCO DE DESPESAS */}
      <div style={{ background: '#fdeded', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#dc3545', margin: '0 0 10px 0' }}>🔴 Despesas</h2>
        {expenses.length === 0 ? <p style={{ color: '#666', margin: 0 }}>Nenhuma despesa cadastrada.</p> : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {expenses.map(renderItem)}
          </ul>
        )}
      </div>

      {/* DASHBOARD FINANCEIRO */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap',
        background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total Receitas</p>
          <h2 style={{ margin: 0, color: '#28a745' }}>R$ {totalReceitas.toFixed(2)}</h2>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Despesas Pagas</p>
          <h2 style={{ margin: 0, color: '#dc3545' }}>- R$ {despesasPagas.toFixed(2)}</h2>
        </div>

        <div style={{ width: '2px', height: '40px', background: '#eee' }}></div> 

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', fontWeight: 'bold' }}>SALDO ATUAL</p>
          <h2 style={{ margin: 0, color: saldoAtual >= 0 ? '#007bff' : '#dc3545', fontSize: '28px' }}>
            R$ {saldoAtual.toFixed(2)}
          </h2>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>Saldo Projetado (Fim do mês)</p>
          <p style={{ margin: 0, color: saldoProjetado >= 0 ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
            R$ {saldoProjetado.toFixed(2)}
          </p>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;