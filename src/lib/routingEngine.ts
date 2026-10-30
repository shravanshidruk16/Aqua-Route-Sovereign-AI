import { 
  Model, 
  HardwareProfile, 
  SensitivityLevel, 
  TaskCategory, 
  RoutingDecision, 
  ExecutionPathType 
} from '@/types';
import { MODELS_CATALOGUE } from '@/data/modelsData';
import { evaluateHardwareCompatibility } from './hardwareDetector';

export interface RoutingPreferences {
  maxBudgetUSD?: number;
  priorityWeight: 'balanced' | 'quality' | 'privacy_first' | 'latency' | 'sustainability';
  allowCloudProviders: boolean;
  blockedProviders?: string[];
}

export function detectTaskCategoryAndComplexity(taskText: string): {
  category: TaskCategory;
  complexity: 'low' | 'medium' | 'high' | 'expert';
  isAgentic: boolean;
  requiresVision: boolean;
} {
  const lower = taskText.toLowerCase();

  const isAgentic = 
    /agent|autonomous|workflow|monitor log|execute command|tool use|automate|pipe|webhook/i.test(lower);
  const requiresVision = 
    /image|picture|photo|blueprint|screenshot|visual|diagram|chart/i.test(lower);

  let category: TaskCategory = 'General Chat';

  if (requiresVision) {
    category = 'Vision';
  } else if (/code|python|typescript|javascript|react|bug|fastapi|function|repo|git|refactor|compile|sql/i.test(lower)) {
    category = 'Coding';
  } else if (/math|equation|calculus|algebra|theorem|formula|proof|derivative|integral/i.test(lower)) {
    category = 'Mathematics';
  } else if (/reason|logic|puzzle|deduction|hypothesis|decision|solve|optimization/i.test(lower)) {
    category = 'Reasoning';
  } else if (/pdf|document|contract|nda|legal|summarize \d+|transcripts|report|extract clause/i.test(lower)) {
    category = 'Document Analysis';
  } else if (/research|investigate|literature|paper|academic|citations|compare algorithms/i.test(lower)) {
    category = 'Research';
  } else if (isAgentic) {
    category = 'Agentic Tool Use';
  }

  // Estimate complexity
  let complexity: 'low' | 'medium' | 'high' | 'expert' = 'medium';
  const wordCount = taskText.trim().split(/\s+/).length;

  if (wordCount < 10 && /rewrite|grammar|translate|hi|hello|define/i.test(lower)) {
    complexity = 'low';
  } else if (/multi-step|optimization|cluster|contract audit|100 documents|autonomous|proof/i.test(lower) || wordCount > 40) {
    complexity = 'expert';
  } else if (wordCount > 20 || /refactor|investigate|benchmark|analyze/i.test(lower)) {
    complexity = 'high';
  }

  return { category, complexity, isAgentic, requiresVision };
}

export function executeRoutingAnalysis(
  taskText: string,
  sensitivity: SensitivityLevel,
  hardware: HardwareProfile,
  preferences: RoutingPreferences = {
    priorityWeight: 'balanced',
    allowCloudProviders: true,
  }
): RoutingDecision {
  const { category, complexity, isAgentic, requiresVision } = detectTaskCategoryAndComplexity(taskText);

  // STAGE 1: PRIVACY GATE
  // A cloud model must NEVER be recommended if sensitivity is CONFIDENTIAL or HIGHLY_SENSITIVE!
  const cloudAllowedByPolicy = 
    preferences.allowCloudProviders && 
    (sensitivity === 'PUBLIC' || sensitivity === 'INTERNAL');

  const whyRejected: { candidateName: string; reason: string }[] = [];
  const whySelected: string[] = [];

  // STAGE 2 & 3: FILTER CANDIDATES & EVALUATE HARDWARE
  interface ScoredCandidate {
    model: Model;
    score: number;
    executionPath: ExecutionPathType;
    hardwarePass: boolean;
    costUSD: number;
    latencyMs: number;
    energyWh: number;
    carbonG: number;
    waterMl: number;
    rejectionReason?: string;
  }

  const scoredCandidates: ScoredCandidate[] = [];

  for (const model of MODELS_CATALOGUE) {
    // Check Privacy Gate
    const isRemoteExecution = !model.isOpenWeight || Boolean(model.groqModelId);
    if (isRemoteExecution && !cloudAllowedByPolicy) {
      whyRejected.push({
        candidateName: model.name,
        reason: `Violates Sovereignty Policy: Task is classified as [${sensitivity}]. Remote transmission to ${model.creator} cloud is strictly prohibited.`,
      });
      continue;
    }

    // Check Vision requirement
    if (requiresVision && !model.modalities.includes('vision')) {
      whyRejected.push({
        candidateName: model.name,
        reason: `Lacks required vision-language capability for image inspection.`,
      });
      continue;
    }

    // Check Hardware compatibility for local open-weight models
    let hardwarePass = true;
    let hardwareEvaluation = evaluateHardwareCompatibility(model, hardware);

    if (model.isOpenWeight) {
      if (hardwareEvaluation.state === 'UNSUPPORTED') {
        hardwarePass = false;
        whyRejected.push({
          candidateName: model.name,
          reason: `Insufficient Local Memory: Requires ${model.minRamRequiredGB} GB RAM, but system only has ${hardware.ramGB} GB RAM.`,
        });
        continue;
      }
    }

    // Calculate simulated cost (assuming ~1,500 input + 600 output tokens average for typical request)
    const estInputTokens = 1500;
    const estOutputTokens = 600;
    const estTotalTokens = estInputTokens + estOutputTokens;

    const costUSD = model.isOpenWeight 
      ? 0.00 
      : ((estInputTokens / 1_000_000) * model.pricing.inputPerMillion) + 
        ((estOutputTokens / 1_000_000) * model.pricing.outputPerMillion);

    const latencyMs = model.benchmarks.avgLatencyMs;
    const energyWh = (estTotalTokens / 1000) * model.sustainability.energyWhPer1kTokens;
    const carbonG = (estTotalTokens / 1000) * model.sustainability.carbonGramsPer1kTokens;
    const waterMl = (estTotalTokens / 1000) * model.sustainability.waterFootprintMlPer1kTokens;

    // Capability score for detected category
    let capabilityScore = 80;
    if (category === 'Coding') capabilityScore = model.scores.coding;
    else if (category === 'Reasoning') capabilityScore = model.scores.reasoning;
    else if (category === 'Mathematics') capabilityScore = model.scores.math;
    else if (category === 'Document Analysis') capabilityScore = model.scores.instruction;
    else if (category === 'Research') capabilityScore = (model.scores.reasoning + model.scores.knowledge) / 2;
    else if (category === 'Vision') capabilityScore = model.scores.multimodal;
    else if (category === 'Agentic Tool Use') capabilityScore = model.scores.toolCalling;

    // Weighting preferences
    let qualityWeight = 0.35;
    let costWeight = 0.20;
    let privacyWeight = 0.20;
    let latencyWeight = 0.15;
    let greenWeight = 0.10;

    if (preferences.priorityWeight === 'privacy_first') {
      privacyWeight = 0.45;
      qualityWeight = 0.30;
      costWeight = 0.15;
    } else if (preferences.priorityWeight === 'quality') {
      qualityWeight = 0.60;
      costWeight = 0.10;
      latencyWeight = 0.15;
      privacyWeight = 0.10;
    } else if (preferences.priorityWeight === 'sustainability') {
      greenWeight = 0.40;
      qualityWeight = 0.30;
      privacyWeight = 0.15;
      costWeight = 0.15;
    }

    const privacyBonus = model.isOpenWeight ? 100 : 40;
    const costBonus = model.isOpenWeight ? 100 : Math.max(0, 100 - (costUSD * 3000));
    const greenBonus = Math.max(0, 100 - (energyWh * 40));
    const latencyBonus = Math.max(0, 100 - (latencyMs / 20));

    const totalScore = 
      (capabilityScore * qualityWeight) +
      (costBonus * costWeight) +
      (privacyBonus * privacyWeight) +
      (latencyBonus * latencyWeight) +
      (greenBonus * greenWeight);

    let executionPath: ExecutionPathType = 'LOCAL_MODEL';
    if (!model.isOpenWeight) {
      executionPath = 'CLOUD_MODEL';
    } else if (isAgentic) {
      executionPath = 'AGENT_WORKFLOW';
    }

    scoredCandidates.push({
      model,
      score: totalScore,
      executionPath,
      hardwarePass,
      costUSD,
      latencyMs,
      energyWh,
      carbonG,
      waterMl,
    });
  }

  // Sort candidates by total score descending
  scoredCandidates.sort((a, b) => b.score - a.score);

  if (scoredCandidates.length === 0) {
    // Fallback if all rejected (e.g. tiny hardware + confidential)
    const fallbackModel = MODELS_CATALOGUE[3]; // Llama 3.2 3B
    return {
      id: `route-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userTask: taskText,
      sensitivityLevel: sensitivity,
      complexity,
      detectedCategory: category,
      executionPath: 'LOCAL_MODEL',
      recommendedModel: fallbackModel,
      executionLocation: 'Ollama / Local Runtime',
      reason: 'Strict privacy constraint required local execution on restricted hardware.',
      whySelected: ['Fits tightly constrained memory footprint', 'Strict zero-cloud data sovereignty'],
      whyRejected,
      expectedQuality: 'Standard',
      expectedLatencyMs: 400,
      estimatedCostUSD: 0,
      estimatedEnergyWh: 0.1,
      estimatedCarbonG: 0.02,
      estimatedWaterMl: 0.15,
      hardwareCompatibilityState: 'COMPATIBLE',
      alternatives: [],
      confidenceScore: 78,
      limitations: 'Due to severe hardware RAM limitations, higher-accuracy models were filtered out.',
    };
  }

  const topPick = scoredCandidates[0];
  const selectedModel = topPick.model;
  const hardwareEval = evaluateHardwareCompatibility(selectedModel, hardware);

  // Generate transparent rationale
  if (selectedModel.groqModelId) {
    whySelected.push(`Blistering Groq LPU throughput (~480 tokens/sec) on active free tier key.`);
    whySelected.push(`Requires 0 GB client RAM; eliminates local fan noise and battery drain.`);
    whySelected.push(`$0.00 compute fees under configured Groq cloud API.`);
    if (category === 'Coding') {
      whySelected.push(`High-accuracy code generation (${selectedModel.benchmarks.humanEval}% HumanEval score).`);
    } else if (category === 'Reasoning' || category === 'Mathematics') {
      whySelected.push(`Rigorous reasoning with internal chain-of-thought traces (${selectedModel.benchmarks.gsm8k}% GSM8K).`);
    }
  } else if (selectedModel.isOpenWeight) {
    whySelected.push(`Guarantees 100% data sovereignty under your [${sensitivity}] data policy.`);
    whySelected.push(`Operates locally with $0.00 cloud API fees.`);
    whySelected.push(`Memory footprint (${selectedModel.minRamRequiredGB} GB) is verified compatible with your ${hardware.ramGB} GB RAM.`);
    if (category === 'Coding') {
      whySelected.push(`Top-tier localized coding performance (${selectedModel.benchmarks.humanEval}% HumanEval score).`);
    } else if (category === 'Reasoning' || category === 'Mathematics') {
      whySelected.push(`Deep analytical step-by-step reasoning verified by ${selectedModel.benchmarks.gsm8k}% GSM8K benchmark.`);
    }
  } else {
    whySelected.push(`State-of-the-art capability (${selectedModel.scores.coding}/100 coding, ${selectedModel.scores.reasoning}/100 reasoning).`);
    whySelected.push(`Policy allows verified cloud transmission for [${sensitivity}] data.`);
    whySelected.push(`Eliminates local compute load and fan noise.`);
    if (requiresVision) {
      whySelected.push(`Native multimodal vision parser with high-fidelity coordinate detection.`);
    }
  }

  const executionLocation = selectedModel.groqModelId
    ? 'Groq Cloud LPU (Ultra-Fast)'
    : (selectedModel.isOpenWeight
      ? (isAgentic ? 'Local Sandboxed Agent' : 'Ollama / Local Runtime')
      : 'Cloud API');

  const alternatives = scoredCandidates.slice(1, 4).map(c => c.model);

  return {
    id: `route-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    userTask: taskText,
    sensitivityLevel: sensitivity,
    complexity,
    detectedCategory: category,
    executionPath: topPick.executionPath,
    recommendedModel: selectedModel,
    executionLocation,
    reason: selectedModel.isOpenWeight
      ? `Task requires ${category.toLowerCase()} capabilities with ${sensitivity.toLowerCase()} governance. ${selectedModel.name} delivers optimum quality locally on your ${hardware.os} system.`
      : `High-complexity task benefits from ${selectedModel.name}'s frontier reasoning and ${selectedModel.contextLength.toLocaleString()} token context window under current cloud policy.`,
    whySelected,
    whyRejected: whyRejected.slice(0, 5),
    expectedQuality: topPick.score > 85 ? 'State-of-the-art' : topPick.score > 70 ? 'High' : 'Standard',
    expectedLatencyMs: Math.round(topPick.latencyMs),
    estimatedCostUSD: Number(topPick.costUSD.toFixed(4)),
    estimatedEnergyWh: Number(topPick.energyWh.toFixed(3)),
    estimatedCarbonG: Number(topPick.carbonG.toFixed(3)),
    estimatedWaterMl: Number(topPick.waterMl.toFixed(2)),
    hardwareCompatibilityState: hardwareEval.state,
    alternatives,
    confidenceScore: Math.min(98, Math.round(topPick.score)),
    limitations: selectedModel.isOpenWeight 
      ? 'Context length is bounded by available local RAM. Running concurrent GPU applications may reduce tokens/sec.'
      : 'Cloud execution requires constant internet connection and consumes provider quota.',
  };
}
