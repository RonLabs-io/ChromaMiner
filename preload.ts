import { contextBridge, ipcRenderer } from 'electron'

// Expor APIs protegidas para o renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  quitApp: () => ipcRenderer.invoke('quit-app'),
  
  // Adicionar mais APIs conforme necessário
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  
  // Event listeners
  onMenuAction: (callback: (action: string) => void) => {
    ipcRenderer.on('menu-action', (_, action) => callback(action))
  },
  
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  }
})

// Definir tipos para o window global
declare global {
  interface Window {
    electronAPI: {
      getAppVersion: () => Promise<string>
      quitApp: () => Promise<void>
      openExternal: (url: string) => Promise<void>
      onMenuAction: (callback: (action: string) => void) => void
      removeAllListeners: (channel: string) => void
    }
  }
}

export {} 