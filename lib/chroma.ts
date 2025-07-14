export interface ChromaConfig {
  url: string
  port: number
  apiKey?: string
  tenant?: string
  database?: string
}

export interface Collection {
  id: string
  name: string
  metadata: Record<string, any>
  count: number
}

export interface Document {
  id: string
  document: string
  metadata: Record<string, any>
  embeddings?: number[]
  distance?: number
}

export class ChromaClient {
  private config: ChromaConfig | null = null

  constructor(config?: ChromaConfig) {
    if (config) {
      this.config = config
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = new URL('/api/chroma', window.location.origin)
    url.searchParams.append('endpoint', endpoint)
    
    if (this.config?.url) {
      url.searchParams.append('url', this.config.url)
    }
    if (this.config?.port) {
      url.searchParams.append('port', this.config.port.toString())
    }
    if (this.config?.apiKey) {
      url.searchParams.append('apiKey', this.config.apiKey)
    }
    
    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorText}`)
    }
    
    return response.json()
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('heartbeat')
      return true
    } catch (error) {
      console.error('Connection test failed:', error)
      return false
    }
  }

  async getCollections(): Promise<Collection[]> {
    try {
      const collections = await this.makeRequest('collections')
      return collections || []
    } catch (error) {
      console.error('Error getting collections:', error)
      throw error
    }
  }

  async getDocuments(collectionName: string, limit: number = 100): Promise<Document[]> {
    try {
      const url = new URL('/api/chroma', window.location.origin)
      url.searchParams.append('endpoint', `collections/${collectionName}/documents`)
      url.searchParams.append('limit', limit.toString())
      
      if (this.config?.url) {
        url.searchParams.append('url', this.config.url)
      }
      if (this.config?.port) {
        url.searchParams.append('port', this.config.port.toString())
      }
      if (this.config?.apiKey) {
        url.searchParams.append('apiKey', this.config.apiKey)
      }
      
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorText}`)
      }
      
      const documents = await response.json()
      return documents || []
    } catch (error) {
      console.error('Error getting documents:', error)
      throw error
    }
  }

  async searchDocuments(
    collectionName: string, 
    query: string, 
    limit: number = 10
  ): Promise<Document[]> {
    try {
      const url = new URL('/api/chroma', window.location.origin)
      url.searchParams.append('endpoint', `collections/${collectionName}/search`)
      
      if (this.config?.url) {
        url.searchParams.append('url', this.config.url)
      }
      if (this.config?.port) {
        url.searchParams.append('port', this.config.port.toString())
      }
      if (this.config?.apiKey) {
        url.searchParams.append('apiKey', this.config.apiKey)
      }
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          limit
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorText}`)
      }
      
      const documents = await response.json()
      return documents || []
    } catch (error) {
      console.error('Error searching documents:', error)
      throw error
    }
  }

  updateConfig(config: ChromaConfig) {
    this.config = config
  }
} 