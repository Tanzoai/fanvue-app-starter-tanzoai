import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/openrouter/models
 * Fetches available models from OpenRouter
 */
export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch models from OpenRouter' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform the data to a simpler format
    const models = data.data?.map((model: any) => ({
      id: model.id,
      name: model.name || model.id,
      pricing: {
        prompt: model.pricing?.prompt || '0',
        completion: model.pricing?.completion || '0',
      },
      context_length: model.context_length || 0,
      description: model.description || '',
    })) || [];

    return NextResponse.json({ models });
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
