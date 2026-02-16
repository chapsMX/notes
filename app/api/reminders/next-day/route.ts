import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

/**
 * GET /api/reminders/next-day
 * 
 * Devuelve todas las capturas con tipo 'reminder' y status 'pending'
 * que están programadas para mañana.
 */
export async function GET(request: NextRequest) {
  try {
    // Get today's date in CDMX timezone
    const now = new Date()
    const cdmxTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }))
    
    // Tomorrow's date
    const tomorrow = new Date(cdmxTime)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const nextDay = new Date(tomorrow)
    nextDay.setDate(nextDay.getDate() + 1)
    nextDay.setHours(0, 0, 0, 0)

    // Query Chapsbox captures with type='reminder' and status='pending'
    const { data: reminders, error } = await supabase
      .from('captures')
      .select('id, title, content, reminder_at, metadata')
      .eq('type', 'reminder')
      .gte('reminder_at', tomorrow.toISOString())
      .lt('reminder_at', nextDay.toISOString())
      .order('reminder_at', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reminders', details: error.message },
        { status: 500 }
      )
    }

    // Format response
    const formattedReminders = reminders?.map(reminder => ({
      id: reminder.id,
      title: reminder.title,
      content: reminder.content,
      remindAt: reminder.reminder_at,
      time: reminder.reminder_at 
        ? new Date(reminder.reminder_at).toLocaleTimeString('es-MX', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        : null,
      metadata: reminder.metadata
    })) || []

    return NextResponse.json({
      success: true,
      count: formattedReminders.length,
      reminders: formattedReminders,
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
