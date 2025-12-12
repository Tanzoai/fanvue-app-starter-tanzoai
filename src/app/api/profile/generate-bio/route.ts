import { NextRequest, NextResponse } from 'next/server';

const BIO_PROMPTS: Record<string, string> = {
  sexy: `You are a professional OnlyFans/Fanvue bio writer specializing in sexy, flirty content.
Create a short, seductive bio (max 150 characters) that:
- Is provocative but classy
- Uses flirty emojis strategically
- Creates intrigue and desire
- Includes a clear call-to-action
- Makes fans want to subscribe immediately`,

  romantic: `You are a professional OnlyFans/Fanvue bio writer specializing in romantic content.
Create a short, sweet bio (max 150 characters) that:
- Is warm and affectionate
- Uses romantic emojis
- Creates an emotional connection
- Feels intimate and personal
- Makes fans feel special`,

  mysterious: `You are a professional OnlyFans/Fanvue bio writer specializing in mysterious content.
Create a short, enigmatic bio (max 150 characters) that:
- Creates curiosity and intrigue
- Uses mysterious emojis
- Leaves fans wanting to know more
- Has an alluring, secretive vibe
- Teases exclusive content`,

  playful: `You are a professional OnlyFans/Fanvue bio writer specializing in playful content.
Create a short, fun bio (max 150 characters) that:
- Is teasing and cheeky
- Uses playful emojis
- Has a lighthearted, flirty tone
- Makes fans smile
- Encourages interaction`,

  confident: `You are a professional OnlyFans/Fanvue bio writer specializing in confident content.
Create a short, bold bio (max 150 characters) that:
- Exudes confidence and power
- Uses strong emojis
- Shows you're in control
- Attracts submissive fans
- Commands attention`,

  girlfriend: `You are a professional OnlyFans/Fanvue bio writer specializing in girlfriend experience content.
Create a short, intimate bio (max 150 characters) that:
- Feels personal and caring
- Uses loving emojis
- Creates a girlfriend vibe
- Makes fans feel desired
- Offers exclusive intimacy`,
};

/**
 * POST /api/profile/generate-bio
 * Generates a new bio using AI based on template and keywords
 */
export async function POST(request: NextRequest) {
  try {
    const { template, includeKeywords, excludeKeywords, model } = await request.json();

    if (!template) {
      return NextResponse.json(
        { error: 'Template is required' },
        { status: 400 }
      );
    }

    const basePrompt = BIO_PROMPTS[template] || BIO_PROMPTS.sexy;

    // Build the complete prompt
    let prompt = basePrompt + '\n\n';

    if (includeKeywords && includeKeywords.length > 0) {
      prompt += `MUST include these keywords/themes: ${includeKeywords.join(', ')}\n`;
    }

    if (excludeKeywords && excludeKeywords.length > 0) {
      prompt += `NEVER use these words: ${excludeKeywords.join(', ')}\n`;
    }

    prompt += '\nGenerate ONE bio only. No explanations, just the bio text.';

    // Call OpenRouter API
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      // Fallback to mock generation if no API key
      const mockBio = generateMockBio(template, includeKeywords);
      return NextResponse.json({ bio: mockBio });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Fanvue App - Bio Generator',
      },
      body: JSON.stringify({
        model: model || 'anthropic/claude-3-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate bio with AI');
    }

    const data = await response.json();
    const bio = data.choices?.[0]?.message?.content?.trim() || generateMockBio(template, includeKeywords);

    return NextResponse.json({ bio });
  } catch (error) {
    console.error('Error generating bio:', error);
    return NextResponse.json(
      { error: 'Failed to generate bio' },
      { status: 500 }
    );
  }
}

/**
 * Fallback mock bio generator
 */
function generateMockBio(template: string, keywords?: string[]): string {
  const bios: Record<string, string[]> = {
    sexy: [
      'Your favorite fantasy is waiting... 🔥 DM me for exclusive content 💋',
      'Let me be your secret obsession 😈 Custom content available 🔞',
      'Spice up your day with me 🌶️ Subscribe for the full experience 💕',
    ],
    romantic: [
      'Let me make you feel special 💕 Exclusive intimate moments await 🌹',
      'Your perfect escape from reality 💖 Sweet & spicy content inside 😊',
      'Romance meets desire 🌙 Join me for something beautiful 💫',
    ],
    mysterious: [
      'Curious what's behind the curtain? 🌙 Find out inside... 🔮',
      'Some secrets are worth discovering 🖤 Are you brave enough? 🔓',
      'Mystery wrapped in desire 🌌 Unlock exclusive access 🗝️',
    ],
    playful: [
      'Come play with me 😈 Fun & flirty content daily 🎮',
      'Life's too short to be boring 🎉 Let's have some fun together 💃',
      'Your favorite tease 😘 Premium content & customs available 🎁',
    ],
    confident: [
      'I know what you need 👑 Subscribe and obey 💅',
      'Bow down to your queen 👸 Exclusive content for loyal subjects 💎',
      'Confidence looks good on me 💋 Can you handle it? 🔥',
    ],
    girlfriend: [
      'Miss me? I miss you too 💕 Let's spend time together 🥰',
      'Your virtual girlfriend awaits 💖 Personalized content & chats 😊',
      'I'm all yours, babe 💗 Exclusive GFE content inside 💌',
    ],
  };

  const templates = bios[template] || bios.sexy;
  let bio = templates[Math.floor(Math.random() * templates.length)];

  // Try to incorporate keywords if provided
  if (keywords && keywords.length > 0) {
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    bio = bio.replace('exclusive', keyword);
  }

  return bio;
}
