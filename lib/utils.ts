import { type ClassValue, clsx } from "clsx"
import { createServer } from 'net'

export const isDev = process.env.NODE_ENV === 'development' 

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Encontra a próxima porta disponível a partir de uma porta inicial
 * @param startPort - Porta inicial para começar a busca
 * @returns Promise<number> - Próxima porta disponível
 */
export async function findAvailablePort(startPort: number = 3000): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer()
    
    server.listen(startPort, () => {
      const port = (server.address() as any)?.port
      server.close(() => {
        resolve(port)
      })
    })
    
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Porta está em uso, tenta a próxima
        findAvailablePort(startPort + 1).then(resolve).catch(reject)
      } else {
        reject(err)
      }
    })
  })
}

/**
 * Verifica se uma porta específica está disponível
 * @param port - Porta para verificar
 * @returns Promise<boolean> - true se a porta estiver disponível
 */
export async function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer()
    
    server.listen(port, () => {
      server.close(() => {
        resolve(true)
      })
    })
    
    server.on('error', () => {
      resolve(false)
    })
  })
} 