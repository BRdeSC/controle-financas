import express from 'express';

const app = express();

// Middleware que permite a nossa API entender arquivos JSON
app.use(express.json());

// O nosso primeiro Endpoint (A Rota de Saúde)
app.get('/health', (request, response) => {
  return response.status(200).json({
    status: 'OK',
    message: 'API do Controle de Contas está a funcionar perfeitamente! 🚀',
    timestamp: new Date().toISOString()
  });
});

export default app;