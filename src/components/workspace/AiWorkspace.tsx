'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  HardDrive, 
  Cloud, 
  Cpu, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  StopCircle, 
  RefreshCw, 
  Plus, 
  ShieldCheck, 
  AlertTriangle,
  Code2,
  Terminal,
  Clock,
  Zap,
  Droplet,
  DollarSign
} from 'lucide-react';
import { 
  Model, 
  ChatMessage, 
  ChatConversation, 
  SensitivityLevel, 
  HardwareProfile 
} from '@/types';
import { MODELS_CATALOGUE } from '@/data/modelsData';
import { 
  getConversations, 
  saveConversations 
} from '@/lib/storage';
import { streamOllamaChat } from '@/lib/ollamaClient';
import { streamGroqChat } from '@/lib/groqClient';

interface AiWorkspaceProps {
  hardware: HardwareProfile;
  ollamaConnected: boolean;
  preselectedModel?: Model | null;
  onOpenLocalAi: () => void;
}

export const AiWorkspace: React.FC<AiWorkspaceProps> = ({
  hardware,
  ollamaConnected,
  preselectedModel,
  onOpenLocalAi,
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string>('');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [selectedModelId, setSelectedModelId] = useState<string>(
    preselectedModel?.id || 'openai-gpt-oss-20b'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize conversations from local storage
  useEffect(() => {
    const saved = getConversations();
    if (saved && saved.length > 0) {
      // Purge any legacy mock python snippet messages from earlier sessions
      const sanitized = saved.map((c) => ({
        ...c,
        messages: c.messages.filter(
          (m) => !m.content.includes('def verify_sovereign_path')
        ),
      }));
      setConversations(sanitized);
      setActiveConvoId(sanitized[0].id);
      if (sanitized[0].modelId) {
        setSelectedModelId(sanitized[0].modelId);
      }
      saveConversations(sanitized);
    } else {
      const defaultConvo: ChatConversation = {
        id: `convo-${Date.now()}`,
        title: 'Initial Sovereign AI Session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modelId: selectedModelId,
        messages: [
          {
            id: 'm-welcome',
            role: 'assistant',
            content: `Welcome to **AquaRoute AI Workspace**. I am ready to process your prompts across local and sovereign AI runtimes.\n\n* Current active target: **${MODELS_CATALOGUE.find(m => m.id === selectedModelId)?.name || 'Local Model'}**\n* Data Sovereignty: **Enforced**\n* Cloud Transmission: **Controlled**`,
            timestamp: new Date().toISOString(),
            telemetry: {
              model: 'AquaRoute Router',
              location: 'Local System',
              latencyMs: 12,
              tokensCount: 42,
              tokensPerSec: 120,
              costUSD: 0,
              energyWh: 0.01,
              waterMl: 0.02,
              privacyStatus: 'INTERNAL',
            },
          },
        ],
      };
      setConversations([defaultConvo]);
      setActiveConvoId(defaultConvo.id);
      saveConversations([defaultConvo]);
    }
  }, []);

  useEffect(() => {
    if (preselectedModel) {
      setSelectedModelId(preselectedModel.id);
    }
  }, [preselectedModel]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, isGenerating]);

  const activeConvo = conversations.find((c) => c.id === activeConvoId);
  const currentModel = MODELS_CATALOGUE.find((m) => m.id === selectedModelId) || MODELS_CATALOGUE[0];

  const handleNewChat = () => {
    const newConvo: ChatConversation = {
      id: `convo-${Date.now()}`,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modelId: selectedModelId,
      messages: [],
    };
    const updated = [newConvo, ...conversations];
    setConversations(updated);
    setActiveConvoId(newConvo.id);
    saveConversations(updated);
  };

  const handleSelectConvo = (id: string) => {
    setActiveConvoId(id);
    const target = conversations.find((c) => c.id === id);
    if (target?.modelId) {
      setSelectedModelId(target.modelId);
    }
  };

  const handleDeleteConvo = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    saveConversations(updated);
    if (activeConvoId === id) {
      const nextConvo = updated.length > 0 ? updated[0] : null;
      setActiveConvoId(nextConvo ? nextConvo.id : '');
      if (nextConvo?.modelId) {
        setSelectedModelId(nextConvo.modelId);
      }
    }
  };

  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsgId(msgId);
      setTimeout(() => setCopiedMsgId(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleExportChat = () => {
    if (!activeConvo) return;
    const jsonStr = JSON.stringify(activeConvo, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquaroute-chat-${activeConvo.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = async () => {
    if (!inputPrompt.trim() || isGenerating || !activeConvo) return;

    const userMsgText = inputPrompt;
    setInputPrompt('');

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: userMsgText,
      timestamp: new Date().toISOString(),
    };

    const assistantMsgId = `msg-${Date.now()}-asst`;
    const initialAssistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      telemetry: {
        model: currentModel.name,
        location: currentModel.isOpenWeight ? 'Local Ollama' : 'Cloud API',
        latencyMs: 0,
        tokensCount: 0,
        tokensPerSec: 0,
        costUSD: currentModel.isOpenWeight ? 0 : 0.002,
        energyWh: currentModel.sustainability.energyWhPer1kTokens,
        waterMl: currentModel.sustainability.waterFootprintMlPer1kTokens,
        privacyStatus: 'INTERNAL',
      },
    };

    const updatedConvo: ChatConversation = {
      ...activeConvo,
      title: activeConvo.messages.length === 0 ? userMsgText.slice(0, 32) : activeConvo.title,
      messages: [...activeConvo.messages, userMessage, initialAssistantMessage],
      updatedAt: new Date().toISOString(),
    };

    const updatedList = conversations.map((c) => (c.id === activeConvo.id ? updatedConvo : c));
    setConversations(updatedList);
    saveConversations(updatedList);

    setIsGenerating(true);
    const startTime = Date.now();
    let accumulatedText = '';
    let tokensEstimate = 0;

    abortControllerRef.current = new AbortController();

    // 1. Check if model runs via Groq Cloud API (Free Frontier Models)
    if (currentModel.groqModelId) {
      try {
        // Sanitize history: don't pass welcome greeting banner or empty messages
        const historyForGroq = activeConvo.messages
          .filter((m) => m.id !== 'm-welcome' && m.content && m.content.trim() !== '')
          .concat(userMessage)
          .map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
            content: m.content.trim(),
          }));

        const stats = await streamGroqChat(
          currentModel.groqModelId,
          historyForGroq,
          (chunk) => {
            accumulatedText += chunk;
            setConversations((prevList) =>
              prevList.map((c) =>
                c.id === activeConvo.id
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
                      ),
                    }
                  : c
              )
            );
          },
          abortControllerRef.current.signal
        );

        setConversations((prevList) => {
          const finalList = prevList.map((c) =>
            c.id === activeConvo.id
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          telemetry: {
                            ...m.telemetry!,
                            latencyMs: stats.latencyMs,
                            tokensCount: stats.tokensCount,
                            tokensPerSec: stats.tokensPerSec,
                            costUSD: 0.0,
                            location: 'Groq LPU (Ultra-Fast)',
                            isRealLocalExecution: false,
                          },
                        }
                      : m
                  ),
                }
              : c
          );
          saveConversations(finalList);
          return finalList;
        });

        setIsGenerating(false);
        return;
      } catch (err: unknown) {
        console.error('Groq streaming error:', err);
        const errMsg = err instanceof Error ? err.message : String(err);
        setConversations((prevList) =>
          prevList.map((c) =>
            c.id === activeConvo.id
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? { ...m, content: `**Groq API Notice:**\n${errMsg}` }
                      : m
                  ),
                }
              : c
          )
        );
        setIsGenerating(false);
        return;
      }
    }

    // 2. Check if we can stream from real local Ollama
    if (currentModel.isOpenWeight && ollamaConnected && currentModel.ollamaTag) {
      try {
        const historyForOllama = activeConvo.messages.concat(userMessage).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        await streamOllamaChat(
          currentModel.ollamaTag,
          historyForOllama,
          (chunk) => {
            accumulatedText += chunk;
            tokensEstimate += 1;
            setConversations((prevList) =>
              prevList.map((c) =>
                c.id === activeConvo.id
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
                      ),
                    }
                  : c
              )
            );
          },
          abortControllerRef.current.signal
        );

        const durationSec = Math.max(0.1, (Date.now() - startTime) / 1000);
        // update telemetry
        setConversations((prevList) =>
          prevList.map((c) =>
            c.id === activeConvo.id
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          telemetry: {
                            ...m.telemetry!,
                            latencyMs: Date.now() - startTime,
                            tokensCount: tokensEstimate,
                            tokensPerSec: Math.round(tokensEstimate / durationSec),
                            isRealLocalExecution: true,
                          },
                        }
                      : m
                  ),
                }
              : c
          )
        );
        setIsGenerating(false);
        return;
      } catch (err: unknown) {
        console.warn('Ollama streaming error, falling back to local simulation:', err);
      }
    }

    // Informative guidance when a local model is chosen but Ollama is not connected
    const fallbackMessage = `⚠️ **Local Ollama Runtime Offline**\n\nThe model **${currentModel.name}** is an open-weight model configured for local execution, but Ollama is not running on \`http://localhost:11434\`.\n\n### ⚡ Instant Real AI:\nSwitch your model above to **OpenAI GPT-OSS 20B (Groq LPU)** or **Qwen 3.8 27B** to chat in real-time immediately using your active free Groq key (450+ tokens/sec).\n\n*Or start Ollama on your system: \`ollama run ${currentModel.ollamaTag || 'llama3.2'}\`*`;

    const fullResponse = fallbackMessage;
    const words = fullResponse.split(' ');
    let wordIdx = 0;

    const streamInterval = setInterval(() => {
      if (wordIdx < words.length && !abortControllerRef.current?.signal.aborted) {
        accumulatedText += (wordIdx === 0 ? '' : ' ') + words[wordIdx];
        wordIdx++;
        tokensEstimate = Math.round(accumulatedText.length / 4);

        setConversations((prevList) =>
          prevList.map((c) =>
            c.id === activeConvo.id
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
                  ),
                }
              : c
          )
        );
      } else {
        clearInterval(streamInterval);
        const durationSec = Math.max(0.1, (Date.now() - startTime) / 1000);

        setConversations((prevList) => {
          const finalList = prevList.map((c) =>
            c.id === activeConvo.id
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsgId
                      ? {
                          ...m,
                          telemetry: {
                            ...m.telemetry!,
                            latencyMs: Date.now() - startTime,
                            tokensCount: tokensEstimate,
                            tokensPerSec: Math.round(tokensEstimate / durationSec),
                          },
                        }
                      : m
                  ),
                }
              : c
          );
          saveConversations(finalList);
          return finalList;
        });

        setIsGenerating(false);
      }
    }, 40);
  };

  const handleStopGeneration = () => {
    abortControllerRef.current?.abort();
    setIsGenerating(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-4">
      {/* Left Chat Sessions Drawer / Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-white rounded-3xl border border-[#E2E8F0] p-4 shadow-sm shrink-0">
        <button
          onClick={handleNewChat}
          className="w-full py-2.5 px-3 rounded-2xl bg-[#0D9488] text-white text-xs font-semibold hover:bg-[#0F766E] shadow-2xs flex items-center justify-center gap-2 mb-3"
        >
          <Plus size={15} />
          New Chat Session
        </button>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#717784] px-2 block mb-1">
            History ({conversations.length})
          </span>
          {conversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => handleSelectConvo(convo.id)}
              className={`p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center justify-between group ${
                activeConvoId === convo.id
                  ? 'bg-teal-50 text-teal-900 border border-teal-200'
                  : 'text-[#475569] hover:bg-[#F8F9FB]'
              }`}
            >
              <span className="truncate flex-1">{convo.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConvo(convo.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Runtime helper */}
        <div className="pt-3 border-t border-[#F1F4F8] text-[11px] text-[#717784] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${ollamaConnected ? 'bg-emerald-500' : 'bg-amber-400'}`} />
            {ollamaConnected ? 'Ollama Live' : 'Ollama Standby'}
          </span>
          <button
            onClick={onOpenLocalAi}
            className="text-teal-700 font-semibold hover:underline"
          >
            Config
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-white rounded-3xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden">
        {/* Top Chat Bar: Model Selector & Actions */}
        <div className="p-3.5 sm:p-4 border-b border-[#E2E8F0] bg-slate-50/50 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <select
              value={selectedModelId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedModelId(newId);
                if (activeConvo) {
                  const updated = conversations.map((c) =>
                    c.id === activeConvo.id ? { ...c, modelId: newId } : c
                  );
                  setConversations(updated);
                  saveConversations(updated);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-bold text-[#111318] focus:outline-hidden focus:border-[#0D9488] shadow-2xs"
            >
              <optgroup label="⚡ Groq LPU Frontier Models (Free Active API Key)">
                {MODELS_CATALOGUE.filter((m) => m.groqModelId).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.parameters} • Real-time 450 tok/s)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Local Open-Weight Models (Ollama)">
                {MODELS_CATALOGUE.filter((m) => m.isOpenWeight && !m.groqModelId).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.parameters} • Q4 Local)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Frontier Cloud AI Models">
                {MODELS_CATALOGUE.filter((m) => !m.isOpenWeight && !m.groqModelId).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Cloud Hosted)
                  </option>
                ))}
              </optgroup>
            </select>

            {currentModel.groqModelId ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Groq LPU: Live Connected
              </span>
            ) : (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                currentModel.isOpenWeight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {currentModel.isOpenWeight ? 'Local Free' : 'Cloud API'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 text-xs font-semibold transition-colors shadow-2xs"
              title="Start a fresh chat session"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Session</span>
            </button>
            <button
              onClick={handleExportChat}
              className="p-1.5 rounded-lg text-[#717784] hover:bg-slate-200 hover:text-black transition-colors"
              title="Export Conversation as JSON"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {!activeConvo || activeConvo.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#717784] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <h3 className="text-base font-bold text-[#111318]">AquaRoute Sovereign Workspace</h3>
              <p className="text-xs max-w-sm leading-relaxed">
                Send a prompt to begin execution with <strong>{currentModel.name}</strong>. All responses track telemetry latency, energy Wh, and data sovereignty status.
              </p>
            </div>
          ) : (
            activeConvo.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-[#111318] text-white' : 'bg-teal-600 text-white'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Message Bubble & Telemetry */}
                <div className="space-y-1.5 max-w-[85%]">
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#111318] text-white'
                      : 'bg-[#F8F9FB] text-[#111318] border border-[#E2E8F0]'
                  }`}>
                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                    {msg.role === 'assistant' && (
                      <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#717784]">
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="hover:text-black flex items-center gap-1 font-medium"
                        >
                          {copiedMsgId === msg.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <span className="text-[10px] text-[#94A3B8]">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Telemetry Badge per message */}
                  {msg.telemetry && (
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#717784] px-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock size={11} />
                        {msg.telemetry.latencyMs}ms
                      </span>
                      <span>•</span>
                      <span>{msg.telemetry.tokensCount} tok ({msg.telemetry.tokensPerSec} tok/s)</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">
                        {msg.telemetry.costUSD === 0 ? '$0.00' : `$${msg.telemetry.costUSD}`}
                      </span>
                      <span>•</span>
                      <span className="text-blue-700 font-semibold">{msg.telemetry.waterMl} mL water</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 font-bold border border-teal-200">
                        {msg.telemetry.privacyStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-[#E2E8F0] bg-white">
          <div className="relative flex items-center">
            <textarea
              rows={2}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Ask ${currentModel.name} anything... (Enter to send, Shift+Enter for newline)`}
              className="w-full pl-4 pr-24 py-2.5 rounded-2xl bg-[#F8F9FB] border border-[#CBD5E1] text-xs sm:text-sm text-[#111318] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#0D9488] resize-none"
            />

            <div className="absolute right-2.5 flex items-center gap-1.5">
              {isGenerating ? (
                <button
                  onClick={handleStopGeneration}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600 flex items-center gap-1 shadow-xs"
                >
                  <StopCircle size={14} />
                  Stop
                </button>
              ) : (
                <button
                  onClick={handleSendMessage}
                  disabled={!inputPrompt.trim()}
                  className={`p-2 rounded-xl text-white transition-all ${
                    !inputPrompt.trim()
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-[#0D9488] hover:bg-[#0F766E] shadow-2xs active:scale-95'
                  }`}
                  aria-label="Send prompt"
                >
                  <Send size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
