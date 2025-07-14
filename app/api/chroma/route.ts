import { NextRequest, NextResponse } from 'next/server'
import { ChromaClient } from 'chromadb'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  const url = searchParams.get('url') || 'http://localhost'
  const port = searchParams.get('port') || '8000'
  const apiKey = searchParams.get('apiKey')
  
  try {
    const host = url.replace(/^https?:\/\//, '')
    const client = new ChromaClient({
      host: host,
      port: parseInt(port),
      ssl: url.startsWith('https'),
      ...(apiKey && {
        auth: {
          provider: 'token',
          credentials: apiKey
        }
      })
    })

    if (endpoint === 'heartbeat') {
      await client.heartbeat()
      return NextResponse.json({ status: 'ok' })
    } else if (endpoint === 'collections') {
      const collections = await client.listCollections()
      
      // Buscar o count de cada coleção
      const collectionsWithCount = await Promise.all(
        collections.map(async (collection: any) => {
          try {
            const col = await client.getCollection({ name: collection.name })
            const count = await col.count()
            return {
              id: collection.id,
              name: collection.name,
              metadata: collection.metadata || {},
              count: count
            }
          } catch (error) {
            return {
              id: collection.id,
              name: collection.name,
              metadata: collection.metadata || {},
              count: 0
            }
          }
        })
      )
      
      return NextResponse.json(collectionsWithCount)
    } else if (endpoint?.startsWith('collections/') && endpoint.endsWith('/documents')) {
      const collectionName = endpoint.replace('collections/', '').replace('/documents', '')
      const limit = parseInt(searchParams.get('limit') || '100')
      
      const collection = await client.getCollection({ name: collectionName })
      const result = await collection.get({
        limit: limit,
        include: ['documents', 'metadatas', 'embeddings']
      })
      
      const documents = []
      if (result.ids && result.ids.length > 0) {
        for (let i = 0; i < result.ids.length; i++) {
          documents.push({
            id: result.ids[i],
            document: result.documents?.[i] || '',
            metadata: result.metadatas?.[i] || {},
            embeddings: result.embeddings?.[i] || undefined
          })
        }
      }
      
      return NextResponse.json(documents)
    } else {
      return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 })
    }
  } catch (error) {
    console.error('ChromaDB Error:', error)
    return NextResponse.json(
      { error: `ChromaDB Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  const url = searchParams.get('url') || 'http://localhost'
  const port = searchParams.get('port') || '8000'
  const apiKey = searchParams.get('apiKey')
  
  try {
    const host = url.replace(/^https?:\/\//, '')
    const client = new ChromaClient({
      host: host,
      port: parseInt(port),
      ssl: url.startsWith('https'),
      ...(apiKey && {
        auth: {
          provider: 'token',
          credentials: apiKey
        }
      })
    })

    if (endpoint?.startsWith('collections/') && endpoint.endsWith('/search')) {
      const collectionName = endpoint.replace('collections/', '').replace('/search', '')
      const body = await request.json()
      const { query, limit = 10 } = body
      
      const collection = await client.getCollection({ name: collectionName })
      
      // Tentar fazer a query semântica apenas se a coleção suportar
      try {
        const result = await collection.query({
          queryTexts: [query],
          nResults: limit,
          include: ['documents', 'metadatas', 'distances']
        })
        
        const documents = []
        if (result.ids && result.ids[0]) {
          for (let i = 0; i < result.ids[0].length; i++) {
            documents.push({
              id: result.ids[0][i],
              document: result.documents?.[0]?.[i] || '',
              metadata: result.metadatas?.[0]?.[i] || {},
              distance: result.distances?.[0]?.[i] || undefined
            })
          }
        }
        
        return NextResponse.json(documents)
      } catch (queryError) {
        // Se a query semântica falhar, fazer busca simples por texto
        console.warn('Semantic search failed, falling back to simple text search:', queryError)
        
        const result = await collection.get({
          include: ['documents', 'metadatas']
        })
        
        const documents = []
        if (result.ids && result.ids.length > 0) {
          for (let i = 0; i < result.ids.length; i++) {
            const doc = result.documents?.[i] || ''
            // Busca simples por texto
            if (doc.toLowerCase().includes(query.toLowerCase())) {
              documents.push({
                id: result.ids[i],
                document: doc,
                metadata: result.metadatas?.[i] || {},
                distance: 0
              })
            }
          }
        }
        
        return NextResponse.json(documents.slice(0, limit))
      }
    } else {
      return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 })
    }
  } catch (error) {
    console.error('ChromaDB Error:', error)
    return NextResponse.json(
      { error: `ChromaDB Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 