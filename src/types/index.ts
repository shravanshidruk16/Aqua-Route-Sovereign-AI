// AquaRoute Sovereign AI - Type Definitions

export type SensitivityLevel = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'HIGHLY_SENSITIVE';

export type BenchmarkSource = 
  | 'official_published' 
  | 'independent_eval' 
  | 'aquaroute_measured' 
  | 'estimated';

export type ExecutionPathType = 
  | 'LOCAL_MODEL' 
  | 'CLOUD_MODEL' 
  | 'PRIVATE_MODEL' 
  | 'SPECIALIZED_TOOL' 
  | 'AGENT_WORKFLOW';

export type HardwareCompatibilityState = 
  | 'COMPATIBLE' 
  | 'COMPATIBLE_WITH_LIMITATIONS' 
  | 'POSSIBLE_WITH_QUANTIZATION' 
  | 'NOT_RECOMMENDED' 
  | 'UNSUPPORTED';

export type TaskCategory = 
  | 'General Chat'
  | 'Coding'
  | 'Reasoning'
  | 'Mathematics'
  | 'Research'
  | 'Document Analysis'
  | 'Vision'
  | 'Multimodal'
  | 'Embeddings'
  | 'Classification'
  | 'Agentic Tool Use';

export interface ModelBenchmarkData {
  mmlu?: number;             // 0 - 100
  humanEval?: number;        // 0 - 100 (Coding)
  gsm8k?: number;            // 0 - 100 (Math)
  math500?: number;          // 0 - 100
  gpqa?: number;             // 0 - 100 (Complex Reasoning)
  tokensPerSecLocal?: number;
  tokensPerSecCloud?: number;
  avgLatencyMs: number;
  source: BenchmarkSource;
  evaluationDate: string;
}

export interface ModelSustainability {
  energyWhPer1kTokens: number;
  waterFootprintMlPer1kTokens: number;
  carbonGramsPer1kTokens: number;
  dataType: 'MEASURED' | 'ESTIMATED' | 'SIMULATED DEMO DATA';
}

export interface Model {
  id: string;
  name: string;
  creator: string;
  family: 'Qwen' | 'Llama' | 'Mistral' | 'DeepSeek' | 'Gemma' | 'Phi' | 'Anthropic' | 'OpenAI' | 'Google' | 'GPT-OSS' | 'Other';
  parameters: string;            // e.g. "7B", "14B", "70B"
  rawParamsInBillions: number;
  version: string;
  releaseDate: string;
  license: string;
  isOpenWeight: boolean;
  isHosted: boolean;
  modalities: ('text' | 'vision' | 'audio' | 'code')[];
  contextLength: number;         // in tokens e.g. 131072
  defaultQuantization: string;    // e.g. "Q4_K_M", "Q8_0", "FP16"
  downloadSizeBytes: number;     // in bytes
  downloadSizeFormatted: string; // e.g. "4.7 GB"
  minRamRequiredGB: number;
  recommendedRamGB: number;
  recommendedVramGB: number;
  supportedRuntimes: ('Ollama' | 'llama.cpp' | 'vLLM' | 'OpenVINO' | 'Cloud API' | 'WebGPU')[];
  ollamaTag?: string;
  groqModelId?: string;
  officialRepoUrl: string;
  officialDocsUrl: string;
  description: string;
  taskCapabilities: TaskCategory[];
  scores: {
    coding: number;       // 0 - 100
    reasoning: number;    // 0 - 100
    math: number;         // 0 - 100
    knowledge: number;    // 0 - 100
    instruction: number;  // 0 - 100
    multimodal: number;   // 0 - 100
    toolCalling: number;  // 0 - 100
  };
  benchmarks: ModelBenchmarkData;
  sustainability: ModelSustainability;
  pricing: {
    inputPerMillion: number;
    outputPerMillion: number;
    isFreeLocal: boolean;
  };
}

export interface OnlineProvider {
  id: string;
  name: string;
  product: string;
  suitableTasks: string[];
  officialUrl: string;
  reasonForRecommendation: string;
  capabilities: string[];
  pricingVerified: string;
  contextWindow: string;
  iconName: string;
}

export interface HardwareProfile {
  os: 'Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS' | 'Unknown';
  browser: string;
  cpuCores: number;
  ramGB: number;
  gpuName?: string;
  vramGB?: number;
  diskFreeGB?: number;
  webGpuAvailable: boolean;
  architecture?: string;
  isAutoDetected: boolean;
  detectionAccuracy: 'exact' | 'estimated' | 'manual_required';
  storageAvailableGB?: number;
}

export interface CandidateEvaluation {
  model: Model;
  executionPath: ExecutionPathType;
  overallScore: number;
  privacyPass: boolean;
  hardwarePass: boolean;
  capabilityPass: boolean;
  rejectionReason?: string;
  scoreBreakdown: {
    quality: number;
    latency: number;
    cost: number;
    energy: number;
    water: number;
    privacy: number;
  };
}

export interface RoutingDecision {
  id: string;
  timestamp: string;
  userTask: string;
  sensitivityLevel: SensitivityLevel;
  complexity: 'low' | 'medium' | 'high' | 'expert';
  detectedCategory: TaskCategory;
  executionPath: ExecutionPathType;
  recommendedModel: Model;
  executionLocation: string;
  reason: string;
  whySelected: string[];
  whyRejected: { candidateName: string; reason: string }[];
  expectedQuality: 'Standard' | 'High' | 'State-of-the-art';
  expectedLatencyMs: number;
  estimatedCostUSD: number;
  estimatedEnergyWh: number;
  estimatedCarbonG: number;
  estimatedWaterMl: number;
  hardwareCompatibilityState: HardwareCompatibilityState;
  alternatives: Model[];
  confidenceScore: number;
  limitations: string;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  archetype: 
    | 'Research Agent'
    | 'Coding Agent'
    | 'Document Agent'
    | 'Data Analysis Agent'
    | 'Local Computer Agent'
    | 'Personal Assistant'
    | 'Automation Agent';
  description: string;
  availableTools: string[];
  modelRequirements: string;
  executionLocation: 'Local Sandboxed' | 'Hybrid Private' | 'Cloud Supervised';
  permissionLevel: 'Safe (Read-Only)' | 'Requires Human Approval' | 'High Sensitivity Guardrail';
  status: 'Ready' | 'Active' | 'Awaiting Approval' | 'Sandboxed';
}

export interface AuditRecord {
  requestId: string;
  timestamp: string;
  taskSnippet: string;
  sensitivity: SensitivityLevel;
  policyApplied: string;
  selectedModel: string;
  executionLocation: string;
  decisionReason: string;
  executionStatus: 'COMPLETED' | 'REDIRECTED_ONLINE' | 'POLICY_BLOCKED' | 'LOCAL_EXECUTED';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  telemetry?: {
    model: string;
    location: string;
    latencyMs: number;
    tokensCount: number;
    tokensPerSec: number;
    costUSD: number;
    energyWh: number;
    waterMl: number;
    privacyStatus: SensitivityLevel;
    isRealLocalExecution?: boolean;
  };
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  modelId: string;
  messages: ChatMessage[];
}
