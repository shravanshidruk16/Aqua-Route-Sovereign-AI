export interface OllamaModelTag {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    format: string;
    family: string;
    families: string[] | null;
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaConnectionStatus {
  isConnected: boolean;
  endpoint: string;
  models: OllamaModelTag[];
  error?: string;
  version?: string;
  corsNoticeNeeded?: boolean;
}

const DEFAULT_ENDPOINT = 'http://localhost:11434';
const STORAGE_KEY_ENDPOINT = 'aquaroute_ollama_endpoint';

export function getOllamaEndpoint(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY_ENDPOINT) || DEFAULT_ENDPOINT;
  }
  return DEFAULT_ENDPOINT;
}

export function setOllamaEndpoint(endpoint: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_ENDPOINT, endpoint.trim().replace(/\/$/, ''));
  }
}

/**
 * Checks connection to local Ollama instance and retrieves installed models.
 * Handles browser CORS errors gracefully and gives explicit instructions.
 */
export async function checkOllamaConnection(customEndpoint?: string): Promise<OllamaConnectionStatus> {
  const endpoint = customEndpoint || getOllamaEndpoint();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${endpoint}/api/tags`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        isConnected: true,
        endpoint,
        models: data.models || [],
      };
    } else {
      return {
        isConnected: false,
        endpoint,
        models: [],
        error: `Ollama returned HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const isCorsOrOffline = errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError') || errorMsg.includes('aborted');

    return {
      isConnected: false,
      endpoint,
      models: [],
      error: isCorsOrOffline 
        ? 'Cannot reach Ollama at localhost. Ollama may be stopped or CORS is blocking browser requests.'
        : errorMsg,
      corsNoticeNeeded: isCorsOrOffline,
    };
  }
}

/**
 * Streams chat completion from local Ollama if available
 */
export async function streamOllamaChat(
  modelTag: string,
  messages: { role: string; content: string }[],
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const endpoint = getOllamaEndpoint();

  const response = await fetch(`${endpoint}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelTag,
      messages,
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Ollama Chat Error ${response.status}: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('ReadableStream not supported by response body.');

  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      const chunkStr = decoder.decode(value, { stream: true });
      const lines = chunkStr.split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.message?.content) {
            onChunk(parsed.message.content);
          }
        } catch {
          // ignore incomplete stream fragments
        }
      }
    }
  }
}
