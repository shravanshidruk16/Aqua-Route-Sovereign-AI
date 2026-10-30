'use client';

import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  KeyRound, 
  Copy, 
  Check, 
  Play, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Activity,
  Layers
} from 'lucide-react';
import { executeRoutingAnalysis } from '@/lib/routingEngine';
import { HardwareProfile } from '@/types';

interface DeveloperCenterProps {
  hardware: HardwareProfile;
}

export const DeveloperCenter: React.FC<DeveloperCenterProps> = ({ hardware }) => {
  const [activeTab, setActiveTab] = useState<'playground' | 'docs' | 'keys'>('playground');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('POST /v1/route/analyze');
  const [snippetLang, setSnippetLang] = useState<'curl' | 'python' | 'ts'>('curl');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Playground state
  const [playgroundTask, setPlaygroundTask] = useState('Build a real-time WebSocket dashboard for IoT sensors');
  const [playgroundSensitivity, setPlaygroundSensitivity] = useState<'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'HIGHLY_SENSITIVE'>('INTERNAL');
  const [playgroundResponseJson, setPlaygroundResponseJson] = useState<string | null>(null);
  const [isExecutingApi, setIsExecutingApi] = useState(false);

  // Mock API Keys
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; key: string; created: string }[]>([
    { id: 'k-1', name: 'Production Backend Gateway', key: 'aq_live_7f893e2849a0bc41d2e', created: '2026-10-28' },
    { id: 'k-2', name: 'Internal CI/CD Pipeline', key: 'aq_test_9013c77e81fa2390a12', created: '2026-10-30' },
  ]);

  const handleRunPlaygroundRequest = () => {
    setIsExecutingApi(true);
    setTimeout(() => {
      if (selectedEndpoint === 'POST /v1/route/analyze') {
        const result = executeRoutingAnalysis(playgroundTask, playgroundSensitivity, hardware);
        setPlaygroundResponseJson(JSON.stringify(result, null, 2));
      } else if (selectedEndpoint === 'GET /v1/health') {
        setPlaygroundResponseJson(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0-sovereign',
          runtimes: {
            ollama: 'connected',
            policyGate: 'active',
            airGapStatus: 'enforced'
          }
        }, null, 2));
      } else {
        setPlaygroundResponseJson(JSON.stringify({
          id: `chatcmpl-${Date.now()}`,
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: 'qwen2.5:7b',
          choices: [{
            index: 0,
            message: {
              role: 'assistant',
              content: 'Execution completed via AquaRoute Sovereign Router.'
            },
            finish_reason: 'stop'
          }],
          usage: {
            prompt_tokens: 35,
            completion_tokens: 14,
            total_tokens: 49
          }
        }, null, 2));
      }
      setIsExecutingApi(false);
    }, 300);
  };

  const handleGenerateKey = () => {
    const newKey = {
      id: `k-${Date.now()}`,
      name: `Developer Token #${apiKeys.length + 1}`,
      key: `aq_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
      created: new Date().toISOString().split('T')[0],
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  // Code Snippets
  const getCodeSnippet = () => {
    if (snippetLang === 'curl') {
      return `curl -X POST https://api.aquaroute.ai/v1/route/analyze \\
  -H "Authorization: Bearer YOUR_AQUAROUTE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "task": "${playgroundTask}",
    "sensitivity": "${playgroundSensitivity}",
    "priority_weight": "balanced",
    "allow_cloud": true
  }'`;
    } else if (snippetLang === 'python') {
      return `import requests

url = "https://api.aquaroute.ai/v1/route/analyze"
headers = {
    "Authorization": "Bearer YOUR_AQUAROUTE_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "task": "${playgroundTask}",
    "sensitivity": "${playgroundSensitivity}",
    "priority_weight": "balanced"
}

response = requests.post(url, json=payload, headers=headers)
decision = response.json()
print("Recommended Model:", decision["recommendedModel"]["name"])
print("Execution Path:", decision["executionPath"])`;
    } else {
      return `import { AquaRouteClient } from '@aquaroute/sdk';

const client = new AquaRouteClient({
  apiKey: process.env.AQUAROUTE_API_KEY
});

const decision = await client.route.analyze({
  task: "${playgroundTask}",
  sensitivity: "${playgroundSensitivity}",
  priorityWeight: "balanced"
});

console.log("Recommended Model:", decision.recommendedModel.name);
console.log("Estimated Water Footprint:", decision.estimatedWaterMl, "mL");`;
    }
  };

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(getCodeSnippet());
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
          <Code2 size={13} className="text-indigo-600" />
          <span>OpenAI-Compatible Sovereign API Gateway</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
          Developer Center
        </h1>
        <p className="text-xs sm:text-sm text-[#717784] max-w-2xl leading-relaxed">
          Integrate AquaRoute routing logic into external backend pipelines, CI/CD workloads, and custom agent applications via standard REST endpoints and Python/TypeScript SDKs.
        </p>
      </div>

      {/* Nav Tabs */}
      <div className="flex gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('playground')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'playground'
              ? 'bg-[#111318] text-white shadow-xs'
              : 'text-[#717784] hover:bg-slate-100'
          }`}
        >
          Interactive API Playground
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'docs'
              ? 'bg-[#111318] text-white shadow-xs'
              : 'text-[#717784] hover:bg-slate-100'
          }`}
        >
          Endpoint Specifications
        </button>
        <button
          onClick={() => setActiveTab('keys')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'keys'
              ? 'bg-[#111318] text-white shadow-xs'
              : 'text-[#717784] hover:bg-slate-100'
          }`}
        >
          API Key Management ({apiKeys.length})
        </button>
      </div>

      {activeTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Request Builder */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F8]">
              <span className="text-xs font-bold text-[#111318]">Request Parameters</span>
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-[#F8F9FB] border border-[#CBD5E1] text-xs font-mono font-semibold text-teal-800"
              >
                <option value="POST /v1/route/analyze">POST /v1/route/analyze</option>
                <option value="POST /v1/chat/completions">POST /v1/chat/completions</option>
                <option value="GET /v1/health">GET /v1/health</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#475569] block mb-1">Task Payload</label>
              <textarea
                rows={3}
                value={playgroundTask}
                onChange={(e) => setPlaygroundTask(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] text-xs font-mono text-[#111318] focus:bg-white focus:outline-hidden focus:border-[#0D9488]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#475569] block mb-1">Sensitivity Policy</label>
                <select
                  value={playgroundSensitivity}
                  onChange={(e) => setPlaygroundSensitivity(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] text-xs font-semibold text-[#111318]"
                >
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="INTERNAL">INTERNAL</option>
                  <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                  <option value="HIGHLY_SENSITIVE">HIGHLY_SENSITIVE</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#475569] block mb-1">Priority Weight</label>
                <select className="w-full p-2.5 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] text-xs font-semibold text-[#111318]">
                  <option value="balanced">balanced</option>
                  <option value="privacy_first">privacy_first</option>
                  <option value="quality">quality</option>
                  <option value="sustainability">sustainability</option>
                </select>
              </div>
            </div>

            {/* Run Button */}
            <div className="pt-2">
              <button
                onClick={handleRunPlaygroundRequest}
                disabled={isExecutingApi}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-2xs flex items-center justify-center gap-1.5"
              >
                {isExecutingApi ? (
                  <span>Executing Mock Gateway...</span>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Send API Request</span>
                  </>
                )}
              </button>
            </div>

            {/* SDK Code Snippets Preview */}
            <div className="pt-3 border-t border-[#F1F4F8] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 text-[11px] font-semibold">
                  <button
                    onClick={() => setSnippetLang('curl')}
                    className={`px-2 py-0.5 rounded ${snippetLang === 'curl' ? 'bg-slate-900 text-white' : 'text-[#717784]'}`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setSnippetLang('python')}
                    className={`px-2 py-0.5 rounded ${snippetLang === 'python' ? 'bg-slate-900 text-white' : 'text-[#717784]'}`}
                  >
                    Python
                  </button>
                  <button
                    onClick={() => setSnippetLang('ts')}
                    className={`px-2 py-0.5 rounded ${snippetLang === 'ts' ? 'bg-slate-900 text-white' : 'text-[#717784]'}`}
                  >
                    TypeScript
                  </button>
                </div>

                <button
                  onClick={handleCopySnippet}
                  className="text-xs text-teal-700 hover:text-teal-800 flex items-center gap-1 font-medium"
                >
                  {copiedSnippet ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedSnippet ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-slate-900 text-teal-300 font-mono text-[11px] overflow-x-auto max-h-40 border border-slate-800 select-all leading-relaxed">
                {getCodeSnippet()}
              </pre>
            </div>
          </div>

          {/* Right: Response Output */}
          <div className="bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-800 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400">Response Payload (HTTP 200 OK)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                application/json
              </span>
            </div>

            <pre className="flex-1 font-mono text-xs text-teal-300 p-3 bg-slate-950 rounded-2xl border border-slate-800 overflow-y-auto max-h-[460px] leading-relaxed select-all mt-3">
              {playgroundResponseJson || `// Click 'Send API Request' to test this endpoint live...`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-4">
          <h2 className="text-base font-bold text-[#111318]">Documented REST API Endpoints</h2>
          <div className="space-y-3 text-xs">
            {[
              {
                method: 'POST',
                path: '/v1/route/analyze',
                desc: 'Analyzes user workload, evaluates hardware RAM feasibility, enforces privacy gate, and returns top Pareto model recommendation.',
              },
              {
                method: 'POST',
                path: '/v1/route/execute',
                desc: 'Executes prompt through the recommended path (local Ollama or proxy cloud) with telemetry stream.',
              },
              {
                method: 'POST',
                path: '/v1/chat/completions',
                desc: 'OpenAI-compatible drop-in chat completions endpoint with automatic sovereign rerouting.',
              },
              {
                method: 'GET',
                path: '/v1/models',
                desc: 'Returns list of verified open-weight and frontier models with published benchmarks and download sizes.',
              },
              {
                method: 'GET',
                path: '/v1/device/compatibility',
                desc: 'Returns hardware evaluation score for any model ID against provided memory parameters.',
              },
              {
                method: 'GET',
                path: '/v1/usage',
                desc: 'Returns cumulative token volume, water footprint milliliters, and cost savings telemetry.',
              },
              {
                method: 'GET',
                path: '/v1/health',
                desc: 'Verifies router uptime, local Ollama runtime readiness, and active policy gateways.',
              },
            ].map((ep, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      ep.method === 'POST' ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{ep.path}</span>
                  </div>
                  <p className="text-[11px] text-[#475569]">{ep.desc}</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 self-start sm:self-center">
                  Bearer Token Auth
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'keys' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F4F8]">
            <div>
              <h2 className="text-base font-bold text-[#111318]">API Keys</h2>
              <p className="text-xs text-[#717784]">Secret tokens for authenticating programmatic requests</p>
            </div>
            <button
              onClick={handleGenerateKey}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-2xs flex items-center gap-1.5"
            >
              <Plus size={14} />
              Create Secret Key
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((k) => (
              <div
                key={k.id}
                className="p-4 rounded-2xl bg-[#F8F9FB] border border-[#E2E8F0] flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <span className="font-bold text-[#111318] block">{k.name}</span>
                  <code className="text-teal-800 font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                    {k.key}
                  </code>
                  <span className="text-[10px] text-[#717784] block mt-0.5">Created on {k.created}</span>
                </div>

                <button
                  onClick={() => handleDeleteKey(k.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50"
                  title="Revoke Key"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
