import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage, type Language, type ImageInput } from '@/lib/gemini/client';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images, language = 'en' } = body as {
      images: ImageInput[];
      language: Language;
    };

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'Missing images array' },
        { status: 400 }
      );
    }

    // Analyze the images with Gemini
    const analysis = await analyzeImage(images, language);

    // Return raw analysis. Prompt building is now reactive on the client.
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Analysis failed: ${message}` },
      { status: 500 }
    );
  }
}
