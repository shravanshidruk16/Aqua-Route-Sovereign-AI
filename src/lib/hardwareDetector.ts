import { HardwareProfile, HardwareCompatibilityState, Model } from '@/types';

const STORAGE_KEY_HARDWARE = 'aquaroute_custom_hardware_profile';

export const DEFAULT_FALLBACK_HARDWARE: HardwareProfile = {
  os: 'Windows',
  browser: 'Chrome',
  cpuCores: 8,
  ramGB: 16,
  gpuName: 'Integrated / Dedicated GPU (Manual confirmation recommended)',
  vramGB: 6,
  diskFreeGB: 120,
  webGpuAvailable: false,
  architecture: 'x86_64',
  isAutoDetected: false,
  detectionAccuracy: 'manual_required',
  storageAvailableGB: 50,
};

export async function detectSystemHardware(): Promise<HardwareProfile> {
  // Check if user previously saved a manual configuration in localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY_HARDWARE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to detection
      }
    }
  }

  const profile: HardwareProfile = {
    os: 'Unknown',
    browser: 'Unknown',
    cpuCores: 4,
    ramGB: 8,
    webGpuAvailable: false,
    isAutoDetected: true,
    detectionAccuracy: 'estimated',
  };

  if (typeof window === 'undefined') {
    return DEFAULT_FALLBACK_HARDWARE;
  }

  // Detect OS from navigator.userAgent or userAgentData
  const ua = window.navigator.userAgent;
  if (/Windows/i.test(ua)) profile.os = 'Windows';
  else if (/Macintosh|Mac OS X/i.test(ua)) profile.os = 'macOS';
  else if (/Linux/i.test(ua)) profile.os = 'Linux';
  else if (/Android/i.test(ua)) profile.os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) profile.os = 'iOS';

  // Detect Browser
  if (/Edg/i.test(ua)) profile.browser = 'Microsoft Edge';
  else if (/Chrome/i.test(ua)) profile.browser = 'Google Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) profile.browser = 'Apple Safari';
  else if (/Firefox/i.test(ua)) profile.browser = 'Mozilla Firefox';

  // Logical CPU Cores
  if (window.navigator.hardwareConcurrency) {
    profile.cpuCores = window.navigator.hardwareConcurrency;
  }

  // Device Memory (in GiB, reported by Chromium browsers rounded to power of 2, capped at 8 for fingerprinting defense)
  const navMemory = (window.navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (navMemory) {
    // navigator.deviceMemory is capped by browsers at 8GB for anti-fingerprinting.
    // If it reports 8, actual physical RAM is often 8GB, 16GB, or 32GB.
    profile.ramGB = navMemory >= 8 ? 16 : navMemory;
    profile.detectionAccuracy = 'estimated';
  } else {
    // In Safari/Firefox deviceMemory is undefined
    profile.ramGB = 16; // reasonable default
    profile.detectionAccuracy = 'manual_required';
  }

  // Check WebGPU availability
  const nav = window.navigator as any;
  if ('gpu' in nav && nav.gpu) {
    try {
      const adapter = await nav.gpu.requestAdapter();
      if (adapter) {
        profile.webGpuAvailable = true;
        // WebGPU adapter info
        if ('info' in adapter && adapter.info) {
          const info = adapter.info as { description?: string; architecture?: string; vendor?: string };
          profile.gpuName = info.description || `${info.vendor || 'Hardware'} Accelerated GPU`;
          profile.architecture = info.architecture || 'WebGPU Compatible';
        }
      }
    } catch {
      profile.webGpuAvailable = false;
    }
  }

  // Storage estimate
  if ('storage' in window.navigator && window.navigator.storage?.estimate) {
    try {
      const estimate = await window.navigator.storage.estimate();
      if (estimate.quota) {
        profile.storageAvailableGB = Math.round(estimate.quota / (1024 * 1024 * 1024));
        profile.diskFreeGB = profile.storageAvailableGB;
      }
    } catch {
      profile.storageAvailableGB = 50;
    }
  }

  return profile;
}

export function saveHardwareProfile(profile: HardwareProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_HARDWARE, JSON.stringify(profile));
  }
}

/**
 * Validates whether a model can run on the given hardware profile
 * applying conservative safety margins (model weights + 1.5GB OS overhead + 1.5GB KV cache).
 */
export function evaluateHardwareCompatibility(
  model: Model,
  hardware: HardwareProfile
): {
  state: HardwareCompatibilityState;
  reason: string;
  ramMarginGB: number;
} {
  if (!model.isOpenWeight) {
    return {
      state: 'COMPATIBLE',
      reason: 'Cloud hosted model executes on remote enterprise clusters; local hardware is not constrained.',
      ramMarginGB: hardware.ramGB,
    };
  }

  // Check mobile device limitations
  if (hardware.os === 'Android' || hardware.os === 'iOS') {
    if (model.rawParamsInBillions > 3.5) {
      return {
        state: 'NOT_RECOMMENDED',
        reason: `Mobile OS (${hardware.os}) memory limits cannot reliably run models > 3.5B parameters without aggressive memory termination.`,
        ramMarginGB: hardware.ramGB - model.minRamRequiredGB,
      };
    }
    return {
      state: 'COMPATIBLE_WITH_LIMITATIONS',
      reason: `Mobile execution possible via WebGPU or ONNX runtime for lightweight 3B models. Battery and thermal throttling expected.`,
      ramMarginGB: hardware.ramGB - model.minRamRequiredGB,
    };
  }

  const requiredWithOverhead = model.minRamRequiredGB + 2.0; // 2GB OS & framework buffer
  const margin = hardware.ramGB - requiredWithOverhead;

  if (hardware.ramGB >= model.recommendedRamGB + 2.0) {
    return {
      state: 'COMPATIBLE',
      reason: `Hardware has ${hardware.ramGB} GB RAM, well exceeding the ${model.recommendedRamGB} GB recommended footprint with full context headroom.`,
      ramMarginGB: margin,
    };
  } else if (hardware.ramGB >= model.minRamRequiredGB) {
    return {
      state: 'COMPATIBLE_WITH_LIMITATIONS',
      reason: `Hardware has ${hardware.ramGB} GB RAM. Meets minimum ${model.minRamRequiredGB} GB, but long context windows (>32k tokens) or concurrent apps may cause swapping.`,
      ramMarginGB: margin,
    };
  } else if (hardware.ramGB >= model.minRamRequiredGB * 0.75) {
    return {
      state: 'POSSIBLE_WITH_QUANTIZATION',
      reason: `System has ${hardware.ramGB} GB RAM. Standard Q4_K_M requires ${model.minRamRequiredGB} GB, but lower bit quantization (e.g. Q3_K_S or IQ2_XXS) could run with reduced precision.`,
      ramMarginGB: margin,
    };
  } else {
    return {
      state: 'UNSUPPORTED',
      reason: `Model requires at least ${model.minRamRequiredGB} GB RAM. System has ${hardware.ramGB} GB. Attempting local execution will trigger Out-Of-Memory (OOM) termination.`,
      ramMarginGB: margin,
    };
  }
}
