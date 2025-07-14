'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Database } from 'lucide-react'
import { ChromaConfig } from '@/lib/chroma'

interface ConnectionFormProps {
  onConnect: (config: ChromaConfig) => void
  onCancel: () => void
  loading: boolean
  error: string | null
}

interface FormData {
  url: string
  port: number
  apiKey: string
  tenant: string
  database: string
}

export default function ConnectionForm({ onConnect, onCancel, loading, error }: ConnectionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      url: 'http://localhost',
      port: 8000,
      apiKey: '',
      tenant: 'default_tenant',
      database: 'default_database'
    }
  })

  const onSubmit = (data: FormData) => {
    const config: ChromaConfig = {
      url: data.url,
      port: data.port,
      apiKey: data.apiKey || undefined,
      tenant: data.tenant || undefined,
      database: data.database || undefined
    }
    onConnect(config)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6" />
            Configurar Conexão ChromaDB
          </CardTitle>
          <CardDescription>
            Insira os dados de conexão do seu servidor ChromaDB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL do Servidor *
                </label>
                <Input
                  {...register('url', { required: 'URL é obrigatória' })}
                  placeholder="http://localhost"
                  className={errors.url ? 'border-red-500' : ''}
                />
                {errors.url && (
                  <p className="text-sm text-red-500 mt-1">{errors.url.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porta *
                </label>
                <Input
                  type="number"
                  {...register('port', { 
                    required: 'Porta é obrigatória',
                    min: { value: 1, message: 'Porta deve ser maior que 0' },
                    max: { value: 65535, message: 'Porta deve ser menor que 65536' }
                  })}
                  placeholder="8000"
                  className={errors.port ? 'border-red-500' : ''}
                />
                {errors.port && (
                  <p className="text-sm text-red-500 mt-1">{errors.port.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key (opcional)
              </label>
              <Input
                type="password"
                {...register('apiKey')}
                placeholder="Deixe em branco se não usar autenticação"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tenant (opcional)
                </label>
                <Input
                  {...register('tenant')}
                  placeholder="default_tenant"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Database (opcional)
                </label>
                <Input
                  {...register('database')}
                  placeholder="default_database"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Conectando...' : 'Conectar'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 