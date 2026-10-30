import { AuditRecord, RoutingDecision, ChatConversation, SensitivityLevel } from '@/types';

const AUDIT_STORAGE_KEY = 'aquaroute_audit_records';
const DECISIONS_STORAGE_KEY = 'aquaroute_recent_routing_decisions';
const CONVERSATIONS_STORAGE_KEY = 'aquaroute_chat_conversations';
const PREFS_STORAGE_KEY = 'aquaroute_user_preferences';

export interface UserPreferences {
  defaultSensitivity: SensitivityLevel;
  localOnlyMode: boolean;
  allowCloudProviders: boolean;
  blockedProviders: string[];
  theme: 'light' | 'dark' | 'system';
  customOllamaUrl: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultSensitivity: 'INTERNAL',
  localOnlyMode: false,
  allowCloudProviders: true,
  blockedProviders: [],
  theme: 'light',
  customOllamaUrl: 'http://localhost:11434',
};

// Initial realistic demo audit logs for investor presentation / demo mode
export const INITIAL_DEMO_AUDIT_LOGS: AuditRecord[] = [
  {
    requestId: 'req-aq-9821',
    timestamp: '2026-10-30T07:15:22Z',
    taskSnippet: 'Audit quarterly balance sheet and vendor SLA contracts for liabilities',
    sensitivity: 'CONFIDENTIAL',
    policyApplied: 'Policy #4: Confidential Isolation (No Public Cloud Egress)',
    selectedModel: 'Qwen 2.5 14B Instruct',
    executionLocation: 'Ollama Local Runtime',
    decisionReason: 'Enforced sovereign boundary; local RAM (16GB) accommodates 14B model.',
    executionStatus: 'LOCAL_EXECUTED',
  },
  {
    requestId: 'req-aq-9820',
    timestamp: '2026-10-30T06:48:10Z',
    taskSnippet: 'Generate TypeScript AST parser for OpenAPI schema generator',
    sensitivity: 'INTERNAL',
    policyApplied: 'Policy #2: Approved Code Assistant Gate',
    selectedModel: 'Qwen 2.5 Coder 7B',
    executionLocation: 'Ollama Local Runtime',
    decisionReason: 'Local Coder scored 92/100, zero API expenditure, 36 tok/s.',
    executionStatus: 'LOCAL_EXECUTED',
  },
  {
    requestId: 'req-aq-9819',
    timestamp: '2026-10-30T05:22:45Z',
    taskSnippet: 'Comparative literature review on speculative decoding across 40 arXiv papers',
    sensitivity: 'PUBLIC',
    policyApplied: 'Policy #1: Public Open Frontier Egress',
    selectedModel: 'Gemini 1.5 Pro (2M Context)',
    executionLocation: 'Cloud API',
    decisionReason: 'Required 450k token context window exceeding local hardware capacity.',
    executionStatus: 'REDIRECTED_ONLINE',
  },
];

export function getAuditLogs(): AuditRecord[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_AUDIT_LOGS;
  const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
  if (!raw) return INITIAL_DEMO_AUDIT_LOGS;
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_AUDIT_LOGS;
  }
}

export function saveAuditLog(record: AuditRecord): void {
  if (typeof window === 'undefined') return;
  const current = getAuditLogs();
  const updated = [record, ...current.slice(0, 49)]; // keep recent 50
  localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
}

export function getRecentDecisions(): RoutingDecision[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(DECISIONS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveRecentDecision(decision: RoutingDecision): void {
  if (typeof window === 'undefined') return;
  const current = getRecentDecisions();
  const filtered = current.filter(d => d.id !== decision.id);
  const updated = [decision, ...filtered.slice(0, 19)];
  localStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(updated));
}

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  const raw = localStorage.getItem(PREFS_STORAGE_KEY);
  if (!raw) return DEFAULT_PREFERENCES;
  try {
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveUserPreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
}

export function getConversations(): ChatConversation[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveConversations(convos: ChatConversation[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(convos));
}
