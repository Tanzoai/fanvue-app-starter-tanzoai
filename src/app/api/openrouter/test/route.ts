import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/openrouter/test
 * Tests a specific OpenRouter model with a message
 */
export async function POST(request: NextRequest) {
  try {
    const { apiKey, model, message } = await request.json();

    if (!apiKey || !model || !message) {
      return NextResponse.json(
        { error: 'API key, model, and message are required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Fanvue App - Model Testing',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to test model' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract response and calculate cost
    const responseText = data.choices?.[0]?.message?.content || 'No response';
    const usage = data.usage;
    
    // Calculate estimated cost (using the pricing from the model)
    let estimatedCost = 0;
    if (usage) {
      // This is a rough estimate - actual costs depend on the model's pricing
      const promptTokens = usage.prompt_tokens || 0;
      const completionTokens = usage.completion_tokens || 0;
      
      // Default pricing (you might want to fetch this from the model data)
      const promptCostPer1K = 0.0001; // Example: $0.0001 per 1K tokens
      const completionCostPer1K = 0.0002; // Example: $0.0002 per 1K tokens
      
      estimatedCost = 
        (promptTokens / 1000) * promptCostPer1K +
        (completionTokens / 1000) * completionCostPer1K;
    }

    return NextResponse.json({
      response: responseText,
      cost: estimatedCost,
      usage,
    });
  } catch (error) {
    console.error('Error testing OpenRouter model:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
