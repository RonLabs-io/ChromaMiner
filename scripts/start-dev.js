const { spawn } = require('child_process');
const { createServer } = require('net');
const fs = require('fs');
const path = require('path');

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

async function startDevelopment() {
  try {
    const port = await findAvailablePort(3000);
    console.log(`Starting Next.js development server on port ${port}`);
    
    // Salva a porta em um arquivo temporário
    fs.writeFileSync('.port', port.toString());
    
    // Inicia o servidor Next.js na porta encontrada
    const nextProcess = spawn('npx', ['next', 'dev', '-p', port.toString()], {
      stdio: 'inherit',
      shell: true
    });
    
    // Aguarda um pouco para o servidor iniciar
    setTimeout(() => {
      console.log(`Starting Electron on port ${port}`);
      const electronProcess = spawn('npx', ['electron', '.'], {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, NODE_ENV: 'development' }
      });
      
      electronProcess.on('close', (code) => {
        console.log(`Electron process exited with code ${code}`);
        nextProcess.kill();
        try {
          fs.unlinkSync('.port');
        } catch (err) {
          // Ignora erro se o arquivo não existir
        }
        process.exit(code);
      });
    }, 3000); // Aguarda 3 segundos para o Next.js iniciar
    
    nextProcess.on('close', (code) => {
      console.log(`Next.js process exited with code ${code}`);
      try {
        fs.unlinkSync('.port');
      } catch (err) {
        // Ignora erro se o arquivo não existir
      }
      process.exit(code);
    });
    
    process.on('SIGINT', () => {
      nextProcess.kill('SIGINT');
      try {
        fs.unlinkSync('.port');
      } catch (err) {
        // Ignora erro se o arquivo não existir
      }
    });
    
    process.on('SIGTERM', () => {
      nextProcess.kill('SIGTERM');
      try {
        fs.unlinkSync('.port');
      } catch (err) {
        // Ignora erro se o arquivo não existir
      }
    });
    
  } catch (error) {
    console.error('Error starting development environment:', error);
    process.exit(1);
  }
}

startDevelopment(); 