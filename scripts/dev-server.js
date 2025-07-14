const { spawn } = require('child_process');
const { createServer } = require('net');

/**
 * Encontra a próxima porta disponível a partir de uma porta inicial
 * @param {number} startPort - Porta inicial para começar a busca
 * @returns {Promise<number>} - Próxima porta disponível
 */
async function findAvailablePort(startPort = 3000) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => {
        resolve(port);
      });
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Porta está em uso, tenta a próxima
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

async function startDevServer() {
  try {
    const port = await findAvailablePort(3000);
    console.log(`Starting Next.js development server on port ${port}`);
    
    // Inicia o servidor Next.js na porta encontrada
    const nextProcess = spawn('npx', ['next', 'dev', '-p', port.toString()], {
      stdio: 'inherit',
      shell: true
    });
    
    // Salva a porta em um arquivo temporário para o Electron ler
    const fs = require('fs');
    fs.writeFileSync('.port', port.toString());
    
    nextProcess.on('close', (code) => {
      console.log(`Next.js process exited with code ${code}`);
      // Remove o arquivo temporário
      try {
        fs.unlinkSync('.port');
      } catch (err) {
        // Ignora erro se o arquivo não existir
      }
    });
    
    process.on('SIGINT', () => {
      nextProcess.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      nextProcess.kill('SIGTERM');
    });
    
  } catch (error) {
    console.error('Error starting development server:', error);
    process.exit(1);
  }
}

startDevServer(); 