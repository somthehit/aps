import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('calendar_data')
      .select('*')
      .order('month_index', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, data: data || [] });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch calendar data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { month_name, month_index, days, academic_year } = body;

    if (!month_name || month_index == null) {
      return NextResponse.json({ success: false, error: 'month_name and month_index are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin()
      .from('calendar_data')
      .insert({ month_name, month_index, days: days || [], academic_year: academic_year || '२०८३' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/calendar-data error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create calendar entry' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, month_name, month_index, days, academic_year } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    const updateData: Record<string, any> = {};
    if (month_name !== undefined) updateData.month_name = month_name;
    if (month_index !== undefined) updateData.month_index = month_index;
    if (days !== undefined) updateData.days = days;
    if (academic_year !== undefined) updateData.academic_year = academic_year;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin()
      .from('calendar_data')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('PUT /api/calendar-data error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update calendar entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'id query param is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin()
      .from('calendar_data')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/calendar-data error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete calendar entry' }, { status: 500 });
  }
}
