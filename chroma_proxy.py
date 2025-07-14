#!/usr/bin/env python3
"""
Servidor proxy para ChromaDB que resolve problemas de CORS
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import chromadb
import json

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas as rotas

# Cache do cliente
client_cache = {}

def get_client(url="localhost", port=8000, api_key=None):
    """Obter cliente ChromaDB (com cache)"""
    cache_key = f"{url}:{port}:{api_key or 'none'}"
    
    if cache_key not in client_cache:
        try:
            client_cache[cache_key] = chromadb.HttpClient(
                host=url.replace('http://', '').replace('https://', ''),
                port=int(port)
            )
        except Exception as e:
            print(f"Erro ao criar cliente: {e}")
            return None
    
    return client_cache.get(cache_key)

@app.route('/heartbeat', methods=['GET'])
def heartbeat():
    """Teste de conexão"""
    url = request.args.get('url', 'localhost')
    port = request.args.get('port', '8000')
    
    try:
        client = get_client(url, port)
        if client:
            # O heartbeat em si já é um teste de conexão
            return jsonify({"status": "ok", "message": "Connected to ChromaDB"})
        else:
            return jsonify({"error": "Failed to create client"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/collections', methods=['GET'])
def list_collections():
    """Listar todas as coleções"""
    url = request.args.get('url', 'localhost')
    port = request.args.get('port', '8000')
    
    try:
        client = get_client(url, port)
        if not client:
            return jsonify({"error": "Failed to create client"}), 500
            
        collections = client.list_collections()
        
        result = []
        for coll in collections:
            try:
                count = coll.count()
                result.append({
                    "id": coll.id,
                    "name": coll.name,
                    "metadata": coll.metadata or {},
                    "count": count
                })
            except Exception as e:
                print(f"Erro ao obter info da coleção {coll.name}: {e}")
                result.append({
                    "id": coll.id,
                    "name": coll.name,
                    "metadata": coll.metadata or {},
                    "count": 0
                })
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/collections/<collection_name>/documents', methods=['GET'])
def get_documents(collection_name):
    """Obter documentos de uma coleção"""
    url = request.args.get('url', 'localhost')
    port = request.args.get('port', '8000')
    limit = int(request.args.get('limit', '100'))
    
    try:
        client = get_client(url, port)
        if not client:
            return jsonify({"error": "Failed to create client"}), 500
            
        collection = client.get_collection(name=collection_name)
        result = collection.get(limit=limit, include=['documents', 'metadatas', 'embeddings'])
        
        documents = []
        for i in range(len(result['ids'])):
            documents.append({
                "id": result['ids'][i],
                "document": result.get('documents', [''])[i] if result.get('documents') else '',
                "metadata": result.get('metadatas', [{}])[i] if result.get('metadatas') else {},
                "embeddings": result.get('embeddings', [None])[i] if result.get('embeddings') else None
            })
        
        return jsonify(documents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/collections/<collection_name>/search', methods=['POST'])
def search_documents(collection_name):
    """Buscar documentos em uma coleção"""
    url = request.args.get('url', 'localhost')
    port = request.args.get('port', '8000')
    
    try:
        data = request.get_json()
        query = data.get('query', '')
        limit = data.get('limit', 10)
        
        client = get_client(url, port)
        if not client:
            return jsonify({"error": "Failed to create client"}), 500
            
        collection = client.get_collection(name=collection_name)
        result = collection.query(
            query_texts=[query],
            n_results=limit,
            include=['documents', 'metadatas', 'distances']
        )
        
        documents = []
        if result['ids'] and result['ids'][0]:
            for i in range(len(result['ids'][0])):
                documents.append({
                    "id": result['ids'][0][i],
                    "document": result.get('documents', [['']])[0][i] if result.get('documents') else '',
                    "metadata": result.get('metadatas', [[{}]])[0][i] if result.get('metadatas') else {},
                    "distance": result.get('distances', [[None]])[0][i] if result.get('distances') else None
                })
        
        return jsonify(documents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Iniciando ChromaDB Proxy Server...")
    print("📍 Servidor rodará em: http://localhost:5000")
    print("🔗 Use este servidor como proxy para ChromaDB")
    app.run(host='localhost', port=5000, debug=False) 