'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Search, FileText, Hash, AlertCircle } from 'lucide-react'
import { ChromaClient, Collection, Document } from '@/lib/chroma'

interface DocumentsViewProps {
  collection: Collection
  chromaClient: ChromaClient
  onBack: () => void
}

export default function DocumentsView({ collection, chromaClient, onBack }: DocumentsViewProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Document[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [collection.name])

  const loadDocuments = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const docs = await chromaClient.getDocuments(collection.name, 100)
      setDocuments(docs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar documentos')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const results = await chromaClient.searchDocuments(collection.name, searchQuery, 20)
      setSearchResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na busca')
    } finally {
      setSearching(false)
    }
  }

  const displayedDocuments = searchResults.length > 0 ? searchResults : documents

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {collection.name}
          </h1>
          <p className="text-gray-600">
            {collection.count} documentos
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Busca Semântica
          </CardTitle>
          <CardDescription>
            Pesquise documentos usando linguagem natural
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua busca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={searching}>
              {searching ? 'Buscando...' : 'Buscar'}
            </Button>
            {searchResults.length > 0 && (
              <Button variant="outline" onClick={() => {
                setSearchQuery('')
                setSearchResults([])
              }}>
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando documentos...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {searchResults.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                Mostrando {searchResults.length} resultados para "{searchQuery}"
              </p>
            </div>
          )}

          {displayedDocuments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum documento encontrado
                </h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Tente uma busca diferente.' : 'Esta coleção está vazia.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {displayedDocuments.map((doc, index) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Hash className="w-4 h-4" />
                      {doc.id}
                      {doc.distance !== undefined && (
                        <span className="ml-auto text-sm font-normal text-gray-500">
                          Distância: {doc.distance.toFixed(4)}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Documento:</h4>
                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded border max-h-40 overflow-y-auto">
                          {doc.document || 'Sem conteúdo'}
                        </p>
                      </div>
                      
                      {Object.keys(doc.metadata).length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Metadados:</h4>
                          <div className="bg-gray-50 p-3 rounded border">
                            <pre className="text-xs text-gray-800 overflow-x-auto">
                              {JSON.stringify(doc.metadata, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                      
                      {doc.embeddings && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Embeddings:</h4>
                          <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                            Vetor de {doc.embeddings.length} dimensões
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 