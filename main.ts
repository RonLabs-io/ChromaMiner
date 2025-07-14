import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { join } from 'path'

// Verificar se está em desenvolvimento
const isDev = process.env.NODE_ENV === 'development'

// Manter referência global da janela
let mainWindow: BrowserWindow | null = null

// Função para criar a janela principal
const createWindow = (): void => {
  // Criar a janela do navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.cjs')
    },
    titleBarStyle: 'default',
    show: false,
    icon: join(__dirname, '../public/favicon.svg'),
    autoHideMenuBar: true
  })

  // Carregar a aplicação
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
  } else {
    mainWindow.loadFile(join(__dirname, '../out/index.html'))
  }

  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  // Gerenciar links externos
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Esta função será chamada quando o Electron terminar
// a inicialização e estiver pronto para criar janelas do navegador
app.whenReady().then(() => {
  createWindow()

  // Menu removido para interface mais limpa

  app.on('activate', () => {
    // No macOS, é comum recriar uma janela na aplicação quando o
    // ícone do dock é clicado e não há outras janelas abertas
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Sair quando todas as janelas forem fechadas, exceto no macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Nesta aplicação, não há outras janelas do navegador sendo abertas
// então este código não será executado
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Manipuladores IPC podem ser definidos aqui
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('quit-app', () => {
  app.quit()
}) 