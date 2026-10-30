import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = 
      process.env.GROQ_API_KEY || 
      req.headers.get('x-groq-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured on the server or in request headers.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { model = 'openai/gpt-oss-20b', messages = [], stream = true, temperature = 0.7 } = body;

    // Filter out empty messages and ensure standard role values
    const sanitizedMessages = Array.isArray(messages)
      ? messages
          .filter((m: any) => m && typeof m.content === 'string' && m.content.trim() !== '')
          .map((m: any) => ({
            role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
            content: m.content.trim(),
          }))
      : [];

    if (sanitizedMessages.length === 0) {
      return NextResponse.json({ error: 'No valid non-empty messages provided.' }, { status: 400 });
    }

    const groqPayload = {
      model,
      messages: sanitizedMessages,
      stream,
      temperature,
    };

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.replace(/["']/g, '').trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groqPayload),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return NextResponse.json(
        { error: `Groq API Error (${groqRes.status}): ${errText}` },
        { status: groqRes.status }
      );
    }

    if (!stream) {
      const data = await groqRes.json();
      return NextResponse.json(data);
    }

    // Streaming response with real-time token forwarding
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let hasStartedReasoning = false;
    let hasEndedReasoning = false;

    const customStream = new ReadableStream({
      async start(controller) {
        const reader = groqRes.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const textChunk = decoder.decode(value, { stream: true });
            const lines = textChunk.split('\n').filter(l => l.trim() !== '');

            for (const line of lines) {
              if (line.includes('[DONE]')) {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }

              if (line.startsWith('data: ')) {
                try {
                  const parsed = JSON.parse(line.replace('data: ', ''));
                  const delta = parsed.choices?.[0]?.delta;

                  let outputChunk = '';

                  // Handle reasoning stream from openai/gpt-oss-20b
                  if (delta?.reasoning) {
                    if (!hasStartedReasoning) {
                      outputChunk += '> **Reasoning Trace:**\n> ';
                      hasStartedReasoning = true;
                    }
                    outputChunk += delta.reasoning.replace(/\n/g, '\n> ');
                  }

                  // Handle content stream
                  if (delta?.content) {
                    if (hasStartedReasoning && !hasEndedReasoning) {
                      outputChunk += '\n\n---\n\n';
                      hasEndedReasoning = true;
                    }
                    outputChunk += delta.content;
                  }

                  if (outputChunk) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ text: outputChunk })}\n\n`)
                    );
                  }
                } catch {
                  // ignore JSON parse fragment
                }
              }
            }
          }
        } catch (err: any) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error while routing to Groq' },
      { status: 500 }
    );
  }
}
