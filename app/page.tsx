'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Settings, Search, FileText } from 'lucide-react'
import { ChromaClient, ChromaConfig, Collection } from '@/lib/chroma'
import ConnectionForm from '@/components/connection-form'
import CollectionsList from '@/components/collections-list'
import ChromaMinerIcon from '@/components/ChromaMinerIcon'

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [chromaClient, setChromaClient] = useState<ChromaClient | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConnectionForm, setShowConnectionForm] = useState(false)

  const handleConnect = async (config: ChromaConfig) => {
    setLoading(true)
    setError(null)
    
    try {
      const client = new ChromaClient(config)
      const connected = await client.testConnection()
      
      if (connected) {
        setChromaClient(client)
        setIsConnected(true)
        setShowConnectionForm(false)
        
        // Buscar coleções
        const collectionsData = await client.getCollections()
        setCollections(collectionsData)
      } else {
        setError('Falha ao conectar com o ChromaDB. Verifique a configuração.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setChromaClient(null)
    setCollections([])
    setError(null)
  }

  if (showConnectionForm) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ChromaMinerIcon className="w-12 h-12 text-indigo-600" size={48} />
              <h1 className="text-4xl font-bold text-gray-900">ChromaMiner</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Mine e explore suas coleções ChromaDB com ferramentas avançadas de busca
            </p>
          </div>
          
          <ConnectionForm 
            onConnect={handleConnect} 
            onCancel={() => setShowConnectionForm(false)}
            loading={loading}
            error={error}
          />
        </div>
      </main>
    )
  }

  if (isConnected && chromaClient) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChromaMinerIcon className="w-10 h-10 text-indigo-600" size={40} />
              <h1 className="text-3xl font-bold text-gray-900">ChromaMiner</h1>
            </div>
            <Button variant="outline" onClick={handleDisconnect}>
              Desconectar
            </Button>
          </div>
          
          <CollectionsList 
            collections={collections} 
            chromaClient={chromaClient} 
          />
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChromaMinerIcon className="w-16 h-16 text-indigo-600" size={64} />
            <h1 className="text-4xl font-bold text-gray-900">ChromaMiner</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8">
            Mine e explore suas coleções ChromaDB com ferramentas avançadas de busca vetorial
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold leading-none tracking-tight flex items-center justify-center gap-2">
                <ChromaMinerIcon className="w-8 h-8 text-indigo-600" />
                Conectar ao ChromaDB
              </CardTitle>
              <CardDescription>
                Configure sua conexão para começar a minerar seus dados vetoriais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Search className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold">Busca Vetorial</h3>
                  <p className="text-sm text-gray-600">
                    Pesquise semanticamente em suas coleções com embeddings
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <h3 className="font-semibold">Explorar Dados</h3>
                  <p className="text-sm text-gray-600">
                    Navegue e visualize documentos e metadados
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Database className="w-12 h-12 mx-auto mb-2 text-purple-500" />
                  <h3 className="font-semibold">Análise Profunda</h3>
                  <p className="text-sm text-gray-600">
                    Analise estruturas de dados e relacionamentos
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => setShowConnectionForm(true)}
                  className="w-full md:w-auto"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar Conexão
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
} 