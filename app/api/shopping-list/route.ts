import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

/**
 * GET /api/shopping-list
 * 
 * Devuelve todos los items de la lista de compras con status 'pending'
 */
export async function GET(request: NextRequest) {
  try {
    // Query shopping_list with status='pending'
    const { data: items, error } = await supabase
      .from('shopping_list')
      .select('id, item, status, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch shopping list', details: error.message },
        { status: 500 }
      )
    }

    // Format response
    const formattedItems = items?.map((item, index) => ({
      id: item.id,
      number: index + 1,
      item: item.item,
      status: item.status,
      addedAt: item.created_at
    })) || []

    return NextResponse.json({
      success: true,
      count: formattedItems.length,
      items: formattedItems,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
