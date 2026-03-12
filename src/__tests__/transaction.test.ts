import request from 'supertest';
import app from '../app';

describe('Testes da API de Finanças', () => {

  it('Deve retornar status 200 e a mensagem OK na rota de health', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });

  // --- O NOSSO NOVO TESTE DE CRUD ---
  it('Deve criar uma nova transação (POST) e depois excluí-la (DELETE)', async () => {
    
    // 1. PREPARAÇÃO: Criamos dados fictícios
    const novaConta = {
      description: "Conta de Teste do Robô",
      amount: 150.50,
      type: "expense",
      dueDate: new Date().toISOString(),
      status: "pending"
    };

    // 2. AÇÃO (CRIAR): O Supertest manda o POST para a nossa rota
    const responsePost = await request(app)
      .post('/transactions')
      .send(novaConta);

    // 3. VERIFICAÇÕES (ASSERT): Conferimos se o Backend fez o trabalho direito
    expect(responsePost.status).toBe(201); // Garante que o status é 201 Created
    expect(responsePost.body).toHaveProperty('id'); // Garante que o Prisma gerou um ID
    expect(responsePost.body.description).toBe("Conta de Teste do Robô"); // Garante que salvou o nome certo

    // Guardamos o ID que o banco gerou
    const idCriado = responsePost.body.id;

    // 4. LIMPEZA (TEARDOWN): Apagamos a conta recém-criada
    const responseDelete = await request(app).delete(`/transactions/${idCriado}`);
    
    // Verifica se a exclusão retornou 204 No Content (sucesso)
    expect(responseDelete.status).toBe(204);
  });

});