'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Shopping() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [items, setItems] = useState<any[]>([])
  const [newItem, setNewItem] = useState('')
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      
      if (data.session) {
        loadItems()
      } else {
        setLoading(false)
      }
    }
    getSession()
  }, [])

  const loadItems = async () => {
    const { data } = await supabase
      .from('shopping_list')
      .select('*')
      .neq('status', 'archived')
      .order('status', { ascending: true })
      .order('created_at', { ascending: true })

    if (data) setItems(data)
    setLoading(false)
  }

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.trim()) return

    const { error } = await supabase
      .from('shopping_list')
      .insert([{ item: newItem.trim() }])

    if (!error) {
      setNewItem('')
      loadItems()
    }
  }

  const toggleItem = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'comprado' : 'pending'
    
    await supabase
      .from('shopping_list')
      .update({ status: newStatus })
      .eq('id', id)

    loadItems()
  }

  const deleteItem = async (id: string) => {
    await supabase
      .from('shopping_list')
      .delete()
      .eq('id', id)

    loadItems()
  }

  if (loading) {
    return <div className="p-8">Cargando...</div>
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Chapsbox</h1>
            <p className="text-gray-600 mb-6">Inicia sesión para acceder</p>
            <Link href="/login" className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const pendingItems = items.filter(i => i.status === 'pending')
  const boughtItems = items.filter(i => i.status === 'comprado')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">📦</span>
            <h1 className="text-xl font-bold text-gray-800">Chapsbox</h1>
          </Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            Salir
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🛒 Lista de compras</h1>

        {/* Add item form */}
        <form onSubmit={addItem} className="mb-8 flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="ej: plátanos, aguacates, café en grano..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Agregar
          </button>
        </form>

        {/* Pending items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Por comprar ({pendingItems.length})
          </h2>
          {pendingItems.length === 0 ? (
            <p className="text-gray-600 py-8 text-center">Sin items</p>
          ) : (
            <div className="space-y-2">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:shadow-md transition"
                >
                  <button
                    onClick={() => toggleItem(item.id, item.status)}
                    className="flex-1 text-left text-gray-800 font-medium hover:text-yellow-600 transition"
                  >
                    ☐ {item.item}
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bought items */}
        {boughtItems.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              ✅ Comprado ({boughtItems.length})
            </h2>
            <div className="space-y-2">
              {boughtItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-green-50 p-4 rounded-lg shadow flex items-center justify-between hover:shadow-md transition"
                >
                  <button
                    onClick={() => toggleItem(item.id, item.status)}
                    className="flex-1 text-left text-gray-500 line-through hover:text-yellow-600 transition"
                  >
                    ☑ {item.item}
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
