'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, FileText, Search, ChevronRight } from 'lucide-react'
import { ChromaClient, Collection } from '@/lib/chroma'
import DocumentsView from '@/components/documents-view'

interface CollectionsListProps {
  collections: Collection[]
  chromaClient: ChromaClient
}

export default function CollectionsList({ collections, chromaClient }: CollectionsListProps) {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)

  if (selectedCollection) {
    return (
      <DocumentsView
        collection={selectedCollection}
        chromaClient={chromaClient}
        onBack={() => setSelectedCollection(null)}
      />
    )
  }

  return (
    <div className="space-y-4">
      {collections.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Database className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma coleção encontrada
            </h3>
            <p className="text-gray-600">
              Seu banco ChromaDB não possui coleções ou elas não puderam ser carregadas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <Card key={collection.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {collection.name}
                </CardTitle>
                <CardDescription>
                  {collection.count} documentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(collection.metadata).length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Metadados:</h4>
                    <div className="space-y-1">
                      {Object.entries(collection.metadata).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="text-xs text-gray-600">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </div>
                      ))}
                      {Object.keys(collection.metadata).length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{Object.keys(collection.metadata).length - 3} mais...
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={() => setSelectedCollection(collection)}
                  className="w-full"
                  variant="outline"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Explorar
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 