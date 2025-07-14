const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

let mainWindow;
let server;
let currentPort = 3000;

const isDev = process.env.NODE_ENV === 'development';
const nextApp = next({ dev: isDev, dir: __dirname });
const handle = nextApp.getRequestHandler();

/**
 * Encontra a próxima porta disponível a partir de uma porta inicial
 * @param {number} startPort - Porta inicial para começar a busca
 * @returns {Promise<number>} - Próxima porta disponível
 */
async function findAvailablePort(startPort = 3000) {
  return new Promise((resolve, reject) => {
    const server = require('net').createServer();
    
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

/**
 * Lê a porta do arquivo temporário em desenvolvimento
 * @returns {number} - Porta lida do arquivo ou 3000 como fallback
 */
function readPortFromFile() {
  try {
    const portFile = path.join(__dirname, '.port');
    if (fs.existsSync(portFile)) {
      const port = parseInt(fs.readFileSync(portFile, 'utf8').trim());
      return isNaN(port) ? 3000 : port;
    }
  } catch (error) {
    console.warn('Could not read port from file:', error.message);
  }
  return 3000;
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'dist/preload.cjs')
    },
    autoHideMenuBar: true,
    show: false,
    icon: path.join(__dirname, 'public/icon.png')
  });

  if (isDev) {
    // Em desenvolvimento, lê a porta do arquivo temporário
    currentPort = readPortFromFile();
    console.log(`> Development server running on port ${currentPort}`);
    mainWindow.loadURL(`http://localhost:${currentPort}`);
    mainWindow.webContents.openDevTools();
  } else {
    try {
      await nextApp.prepare();
      
      // Encontra uma porta disponível para produção
      currentPort = await findAvailablePort(3000);
      
      server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      });

      server.listen(currentPort, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${currentPort}`);
        mainWindow.loadURL(`http://localhost:${currentPort}`);
      });
    } catch (error) {
      console.error('Error starting Next.js server:', error);
      // Fallback para arquivos estáticos se o Next.js falhar
      mainWindow.loadFile(path.join(__dirname, 'out/index.html'));
    }
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (server) {
      server.close();
    }
  });
}

app.whenReady().then(() => createWindow());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (server) {
    server.close();
  }
}); 