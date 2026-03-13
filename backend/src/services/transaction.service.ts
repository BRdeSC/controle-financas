import {
  TransactionRepository,
  CreateTransactionData,
} from '../repositories/transaction.repository';

export const TransactionService = {

  // Adicione dentro do TransactionService
  async findByMonth(month: number, year: number) {
    // Aqui você pode adicionar alguma regra de negócio se precisar, 
    // por exemplo, validar se o mês está entre 1 e 12.
    return await TransactionRepository.findByMonth(month, year);
  },

  // O Service recebe os dados, valida as regras e depois manda para o Repository
  async create(data: CreateTransactionData) {
    // Regra 1: A descrição precisa ter pelo menos 3 caracteres
    if (!data.description || data.description.trim().length < 3) {
      throw new Error('A descrição deve ter pelo menos 3 caracteres.');
    }

    // Regra 2: O valor tem que ser maior que zero
    if (data.amount <= 0) {
      throw new Error('O valor da transação deve ser maior que zero.');
    }

    // Regra 3: Só aceitamos 'income' (receitas) ou 'expense' (despesas)
    if (data.type !== 'income' && data.type !== 'expense') {
      throw new Error("O tipo deve ser 'income' ou 'expense'.");
    }

    // Se passou por todas as validações, chamamos o Repository para salvar no MySQL!
    const transaction = await TransactionRepository.create(data);

    return transaction;
  },

  async findAll() {
    const transactions = await TransactionRepository.findAll();
    return transactions;
  },

  async update(id: string, data: Partial<CreateTransactionData>) {
    // Regra de Negócio: Se o status que vier for "paid" (pago) e não tiver data de pagamento,
    // nós preenchemos automaticamente com a data e hora de agora!
    if (data.status === 'paid' && !data.paymentDate) {
      data.paymentDate = new Date();
    }

    const transaction = await TransactionRepository.update(id, data);
    return transaction;
  },

  async delete(id: string) {
    // Aqui poderíamos ter uma regra tipo "Não pode apagar contas já pagas",
    // mas por enquanto vamos deixar excluir qualquer uma.
    await TransactionRepository.delete(id);
  },
};
