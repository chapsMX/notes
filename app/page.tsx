'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📦</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Chapsbox</h1>
            <p className="text-gray-600">Tu segundo cerebro en la nube</p>
          </div>
          <Link href="/login" className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition">
            Inicia sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📦</span>
            <h1 className="text-xl font-bold text-gray-800">Chapsbox</h1>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            Salir
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/captures" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-3xl mb-2">📝</div>
            <h2 className="font-semibold text-gray-800">Todas</h2>
            <p className="text-sm text-gray-600">Ver todo lo capturado</p>
          </Link>
          <Link href="/categories/supermercado" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-3xl mb-2">🛒</div>
            <h2 className="font-semibold text-gray-800">Supermercado</h2>
            <p className="text-sm text-gray-600">Tu lista de compras</p>
          </Link>
          <Link href="/collections/c13studio" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-3xl mb-2">📸</div>
            <h2 className="font-semibold text-gray-800">c13studio</h2>
            <p className="text-sm text-gray-600">Inspiración y referencias</p>
          </Link>
          <Link href="/search" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-3xl mb-2">🔍</div>
            <h2 className="font-semibold text-gray-800">Buscar</h2>
            <p className="text-sm text-gray-600">Encuentra cualquier cosa</p>
          </Link>
        </div>

        {/* Coming soon */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800">🚀 Más funciones en desarrollo...</p>
        </div>
      </div>
    </div>
  )
}
