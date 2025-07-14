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
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002'
    const url = new URL('/api/chroma', baseUrl)
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
    
    const requestOptions: RequestInit = {
      ...options,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      cache: 'no-cache',
    }
    
    try {
      console.log('Making request to:', url.toString())
      const response = await fetch(url.toString(), requestOptions)
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorText}`)
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      return data
    } catch (error) {
      console.error('Fetch error details:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        url: url.toString(),
        options: requestOptions,
        location: typeof window !== 'undefined' ? window.location.href : 'server'
      })
      throw error
    }
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
      const url = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002'
      const requestUrl = new URL('/api/chroma', url)
      requestUrl.searchParams.append('endpoint', `collections/${collectionName}/documents`)
      requestUrl.searchParams.append('limit', limit.toString())
      
      if (this.config?.url) {
        requestUrl.searchParams.append('url', this.config.url)
      }
      if (this.config?.port) {
        requestUrl.searchParams.append('port', this.config.port.toString())
      }
      if (this.config?.apiKey) {
        requestUrl.searchParams.append('apiKey', this.config.apiKey)
      }
      
      const response = await fetch(requestUrl.toString())
      
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
      const url = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002'
      const requestUrl = new URL('/api/chroma', url)
      requestUrl.searchParams.append('endpoint', `collections/${collectionName}/search`)
      
      if (this.config?.url) {
        requestUrl.searchParams.append('url', this.config.url)
      }
      if (this.config?.port) {
        requestUrl.searchParams.append('port', this.config.port.toString())
      }
      if (this.config?.apiKey) {
        requestUrl.searchParams.append('apiKey', this.config.apiKey)
      }
      
      const response = await fetch(requestUrl.toString(), {
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