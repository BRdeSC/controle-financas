import request from 'supertest';
import app from '../app';

describe('Testes da API de Finanças', () => {
  let token: string;

  beforeAll(async () => {
    // 1. Geramos um email único para evitar erro de duplicata no banco
    const emailTeste = `test-${Date.now()}@robot.com`;

    // 2. Criamos o usuário de teste
    const resRegistro = await request(app).post('/auth/register').send({
      name: "Tester", 
      email: emailTeste, 
      password: "123"
    });

    if (resRegistro.status !== 201) {
      console.error("LOG DE ERRO REGISTRO:", resRegistro.body);
    }

    // 3. Fazemos o login com o MESMO email
    const resLogin = await request(app).post('/auth/login').send({
      email: emailTeste,
      password: "123"
    });

    // 4. Armazenamos o token
    token = resLogin.body.token;

    // Se o token não vier, mostramos a resposta do servidor para diagnosticar
    if (!token) {
      console.error("LOG DE ERRO LOGIN:", resLogin.body);
      throw new Error("Falha Crítica: O token não foi gerado. Verifique os logs acima.");
    }
  });

  it('Deve retornar status 200 na rota de health (Sem Token)', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });

  it('Deve criar uma nova transação (POST) e depois excluí-la (DELETE)', async () => {
    const novaConta = {
      description: "Conta de Teste do Robô",
      amount: 150.50,
      type: "expense",
      dueDate: new Date().toISOString(),
      status: "pending"
    };

    // Criar com Token no Header
    const responsePost = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send(novaConta);

    expect(responsePost.status).toBe(201);
    expect(responsePost.body).toHaveProperty('id');
    
    const idCriado = responsePost.body.id;

    // Deletar com Token no Header
    const responseDelete = await request(app)
      .delete(`/transactions/${idCriado}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(responseDelete.status).toBe(204);
  });

  it("Deve filtrar transações pelo mês correto (Março/2026)", async () => {
    // Criamos a transação para o teste de filtro
    await request(app)
      .post("/transactions")
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: "Conta de Março",
        amount: 100,
        type: "expense",
        dueDate: "2026-03-15T10:00:00.000Z",
        status: "pending"
      });

    const response = await request(app)
      .get("/transactions/filter")
      .set('Authorization', `Bearer ${token}`)
      .query({ month: 3, year: 2026 });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    const contemConta = response.body.some(
      (t: any) => t.description === "Conta de Março"
    );
    expect(contemConta).toBe(true);
  });

  it("Não deve mostrar a conta de Março quando filtrado por Abril", async () => {
    const response = await request(app)
      .get("/transactions/filter")
      .set('Authorization', `Bearer ${token}`)
      .query({ month: 4, year: 2026 });

    const contemContaMarço = response.body.some(
      (t: any) => t.description === "Conta de Março"
    );
    
    expect(contemContaMarço).toBe(false);
  });
});