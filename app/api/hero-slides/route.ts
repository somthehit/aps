import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { uploadFileToMediaBucket } from '@/lib/storage';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('hero_slides')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let image_url = '';
    let caption: string | null = null;
    let display_order = 0;

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file') as File | null;
      caption = (form.get('caption') as string) || null;
      if (file) {
        const { url } = await uploadFileToMediaBucket(file, 'hero-slides');
        image_url = url;
      } else {
        image_url = (form.get('image_url') as string) || '';
      }
    } else {
      const body = await request.json();
      image_url = body.image_url || '';
      caption = body.caption || null;
      display_order = body.display_order ?? 0;
    }

    if (!image_url) {
      return NextResponse.json({ success: false, error: 'Image file or URL is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin()
      .from('hero_slides')
      .insert({ image_url, caption, display_order })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/hero-slides error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create hero slide' }, { status: 500 });
  }
}
