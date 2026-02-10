'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Captures() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [captures, setCaptures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCaptures = async () => {
      const { data, error } = await supabase
        .from('captures')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false })
        .limit(50)

      if (data) setCaptures(data)
      setLoading(false)
    }

    loadCaptures()
  }, [])

  if (loading) {
    return <div className="p-8">Cargando capturas...</div>
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
          <Link href="/search" className="text-blue-600 hover:text-blue-800">
            🔍 Buscar
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Todas las capturas</h1>

        {captures.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No hay capturas aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {captures.map((capture) => (
              <div key={capture.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 flex-1">{capture.title || 'Sin título'}</h3>
                  {capture.category && (
                    <span className="text-2xl">{capture.category.emoji}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{capture.content}</p>
                <div className="text-xs text-gray-500">
                  {new Date(capture.created_at).toLocaleDateString('es-MX')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
