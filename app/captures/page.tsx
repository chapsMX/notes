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
  const [selectedCapture, setSelectedCapture] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      // Load all captures with attachments and tags
      const { data: capturesData } = await supabase
        .from('captures')
        .select(`
          *,
          category:categories(*),
          attachments(*),
          capture_tags(
            tag:tags(*)
          )
        `)
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
              <button
                key={capture.id}
                onClick={() => setSelectedCapture(capture)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col text-left cursor-pointer"
              >
                {/* Image preview if attachment exists */}
                {capture.attachments && capture.attachments.length > 0 && (
                  <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                    {capture.attachments[0].url && (
                      <img
                        src={
                          capture.attachments[0].url.startsWith('http')
                            ? capture.attachments[0].url
                            : `https://btpkekugwwolvojquxdo.supabase.co/storage/v1/object/public/captures/${capture.attachments[0].url}`
                        }
                        alt={capture.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3ESin imagen%3C/text%3E%3C/svg%3E`;
                        }}
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
                    <div className="text-xs text-blue-600 mb-3">
                      🔗 {capture.source_platform || 'Link'}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    {new Date(capture.created_at).toLocaleDateString('es-MX')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Modal for full capture details */}
        {selectedCapture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 flex justify-between items-center p-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedCapture.title || 'Sin título'}</h2>
                <button
                  onClick={() => setSelectedCapture(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Full image if exists */}
                {selectedCapture.attachments && selectedCapture.attachments.length > 0 && (
                  <div className="w-full">
                    {selectedCapture.attachments[0].url && (
                      <img
                        src={
                          selectedCapture.attachments[0].url.startsWith('http')
                            ? selectedCapture.attachments[0].url
                            : `https://btpkekugwwolvojquxdo.supabase.co/storage/v1/object/public/captures/${selectedCapture.attachments[0].url}`
                        }
                        alt={selectedCapture.title}
                        className="w-full rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E`;
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Category */}
                {selectedCapture.category && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">CATEGORÍA</p>
                    <div className="inline-flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                      <span className="text-xl">{selectedCapture.category.emoji}</span>
                      <span className="font-medium text-gray-800">{selectedCapture.category.name}</span>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedCapture.capture_tags && selectedCapture.capture_tags.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">TAGS</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCapture.capture_tags.map((ct: any) => (
                        <span
                          key={ct.tag.id}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          #{ct.tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full content */}
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">DESCRIPCIÓN</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedCapture.content}</p>
                </div>

                {/* Source URL */}
                {selectedCapture.source_url && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">FUENTE</p>
                    <a
                      href={selectedCapture.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                    >
                      {selectedCapture.source_platform && `🔗 ${selectedCapture.source_platform}`}
                      <br />
                      {selectedCapture.source_url}
                    </a>
                  </div>
                )}

                {/* Date and metadata */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500">
                    Creado: {new Date(selectedCapture.created_at).toLocaleDateString('es-MX')} {new Date(selectedCapture.created_at).toLocaleTimeString('es-MX')}
                  </p>
                  {selectedCapture.is_starred && (
                    <p className="text-xs text-yellow-600 mt-1">⭐ Marcado como importante</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
