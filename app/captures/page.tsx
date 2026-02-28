'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function Captures() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [captures, setCaptures] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      // Load all captures with attachments
      const { data: capturesData } = await supabase
        .from('captures')
        .select('*, category:categories(*), attachments(*)')
        .order('created_at', { ascending: false })
        .limit(50)

      if (capturesData) setCaptures(capturesData)

      // Load all categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (categoriesData) setCategories(categoriesData)
      setLoading(false)
    }

    loadData()
  }, [])

  // Filter captures by selected category
  const filteredCaptures = selectedCategory
    ? captures.filter(c => c.category?.id === selectedCategory)
    : captures

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

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedCategory === null
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {filteredCaptures.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No hay capturas en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCaptures.map((capture) => (
              <div key={capture.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
                {/* Image preview if attachment exists */}
                {capture.attachments && capture.attachments.length > 0 && (
                  <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                    {capture.attachments[0].url && (
                      <img
                        src={capture.attachments[0].url}
                        alt={capture.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 flex-1 text-base">{capture.title || 'Sin título'}</h3>
                    {capture.category && (
                      <span className="text-xl ml-2">{capture.category.emoji}</span>
                    )}
                  </div>
                  
                  {/* Category name */}
                  {capture.category && (
                    <p className="text-xs font-medium text-yellow-600 mb-2 uppercase">
                      {capture.category.name}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{capture.content}</p>
                  
                  {/* Source URL if exists */}
                  {capture.source_url && (
                    <a
                      href={capture.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline mb-3 break-all"
                    >
                      🔗 {capture.source_platform || 'Link'}
                    </a>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    {new Date(capture.created_at).toLocaleDateString('es-MX')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
