export interface GroqStreamStats {
  tokensCount: number;
  tokensPerSec: number;
  latencyMs: number;
}

/**
 * Streams chat completion from Groq LPU via the internal /api/groq/chat route
 */
export async function streamGroqChat(
  groqModelId: string,
  messages: { role: string; content: string }[],
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<GroqStreamStats> {
  const startTime = Date.now();
  let firstTokenTime: number | null = null;
  let tokensEstimate = 0;

  const res = await fetch('/api/groq/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: groqModelId,
      messages,
      stream: true,
    }),
    signal,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || `HTTP ${res.status}: Failed to communicate with Groq`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('ReadableStream not supported by response body.');

  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;

    if (value) {
      if (!firstTokenTime) {
        firstTokenTime = Date.now();
      }

      const chunkStr = decoder.decode(value, { stream: true });
      const lines = chunkStr.split('\n').filter((l) => l.startsWith('data: '));

      for (const line of lines) {
        if (line.includes('[DONE]')) continue;

        try {
          const parsed = JSON.parse(line.replace('data: ', ''));
          if (parsed.text) {
            tokensEstimate += Math.max(1, Math.round(parsed.text.length / 4));
            onChunk(parsed.text);
          }
        } catch {
          // ignore stream fragment
        }
      }
    }
  }

  const totalTimeSec = Math.max(0.05, (Date.now() - (firstTokenTime || startTime)) / 1000);
  const latencyMs = (firstTokenTime || Date.now()) - startTime;
  const tokensPerSec = Math.round(tokensEstimate / totalTimeSec);

  return {
    tokensCount: tokensEstimate,
    tokensPerSec,
    latencyMs,
  };
}
