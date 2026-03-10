// 1. Criando uma Interface (Molde) para a nossa Transação
interface Transaction {
  description: string;
  amount: number;
  type: 'income' | 'expense'; // Só aceita esses dois textos exatos!
}

// 2. Função tipada: Recebe um Array de Transações e devolve um Número
function calculateBalance(transactions: Transaction[]): number {
  let balance = 0;
  
  for (const t of transactions) {
    if (t.type === 'income') {
      balance += t.amount;
    } else {
      balance -= t.amount;
    }
  }
  
  return balance;
}

// 3. Testando na prática
const myTransactions: Transaction[] = [
  { description: 'Salário', amount: 3000, type: 'income' },
  { description: 'Conta de Luz', amount: 150, type: 'expense' },
  { description: 'Internet', amount: 100, type: 'expense' }
];

const currentBalance = calculateBalance(myTransactions);

console.log("=== CONTROLE DE CONTAS ===");
console.log(`Saldo Atual: R$ ${currentBalance}`);