import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

/**
 * POST /api/captures
 * 
 * Guarda una nueva captura en Chapsbox
 * 
 * Body:
 * {
 *   category: string (reels|inspiracion|personal|recordatorios|referencias|trabajo|viajes|links|notas)
 *   link?: string (opcional)
 *   description: string (nota)
 *   tags?: string[] (array de tags)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, link, description, tags } = body

    // Validate required fields
    if (!category || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: category and description' },
        { status: 400 }
      )
    }

    // Insert into captures table
    const { data: capture, error } = await supabase
      .from('captures')
      .insert({
        category,
        link: link || null,
        description,
        tags: tags || [],
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save capture', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Capture saved successfully',
      capture
    }, { status: 201 })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/captures
 * 
 * Retorna todas las capturas o filtra por categoría
 * 
 * Query params:
 * - category?: string (filtrar por categoría)
 * - limit?: number (default 50)
 * - offset?: number (default 0)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('captures')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data: captures, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch captures', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      count: captures?.length || 0,
      total: count || 0,
      captures: captures || []
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
