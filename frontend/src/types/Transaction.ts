// frontend/src/types/Transaction.ts

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  dueDate: string; // As datas chegam do backend como texto (String ISO)
  paymentDate?: string | null;
  status: 'pending' | 'paid';
}
