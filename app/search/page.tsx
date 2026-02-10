'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Search() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)

    if (q.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    const { data } = await supabase
      .from('captures')
      .select('*, category:categories(*)')
      .or(`title.ilike.%${q}%,content.ilike.%${q}%,user_context.ilike.%${q}%`)
      .order('created_at', { ascending: false })
      .limit(20)

    if (data) setResults(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">📦</span>
            <h1 className="text-xl font-bold text-gray-800">Chapsbox</h1>
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Buscar</h1>

        <input
          type="text"
          placeholder="Busca en tu segundo cerebro... (arquitectura, ajo, brutalismo, etc.)"
          value={query}
          onChange={handleSearch}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg"
        />

        {loading && <p className="mt-4 text-gray-600">Buscando...</p>}

        {results.length > 0 && (
          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-4">{results.length} resultado(s)</p>
            <div className="space-y-4">
              {results.map((capture) => (
                <div key={capture.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{capture.title || 'Sin título'}</h3>
                      {capture.user_context && (
                        <p className="text-xs text-gray-500 mt-1">Para: {capture.user_context}</p>
                      )}
                    </div>
                    {capture.category && (
                      <span className="text-2xl ml-4">{capture.category.emoji}</span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{capture.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{capture.category?.name}</span>
                    <span>{new Date(capture.created_at).toLocaleDateString('es-MX')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {query.length >= 2 && results.length === 0 && !loading && (
          <div className="mt-8 text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No se encontraron resultados</p>
          </div>
        )}
      </div>
    </div>
  )
}
