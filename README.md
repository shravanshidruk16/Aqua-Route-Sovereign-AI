# AquaRoute Sovereign AI

<p align="center">
  <strong>"One Intelligence. Every Model. The Right Execution Path."</strong><br>
  <em>"Don't Choose an AI. Let AquaRoute Find Your Best AI."</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19.3-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Groq_LPU-Connected-F55036?logo=speedtest" alt="Groq LPU" />
  <img src="https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify" alt="Netlify Deployable" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" />
</p>

AquaRoute Sovereign AI is an intelligent AI workload discovery, recommendation, execution, and deployment platform. It functions as an autonomous AI traffic controller that routes workloads across local edge models (via Ollama) and ultra-fast frontier cloud models (via Groq LPUs) based on task intent, data sensitivity, hardware constraints, monetary cost, and environmental footprints (energy and water consumption).

---

## Architecture & Core Modules

### 1. AI Navigator Engine
- **Deterministic Multi-Stage Routing Pipeline**:
  1. **Workload Intent Analysis**: Automated classification across General Chat, Coding, Reasoning, Mathematics, Document Processing, Multimodal, and Agentic Tool Use.
  2. **Hard Sovereignty Gate**: Strict enforcement of data classification policies (`PUBLIC`, `INTERNAL`, `CONFIDENTIAL`, `HIGHLY_SENSITIVE`). Confidential and sensitive workloads strictly block cloud transmission with an unbypassable air-gap boundary.
  3. **Hardware Feasibility Filter**: Evaluates model parameter sizes (7B, 14B, 32B, 70B) and quantization levels (Q4/Q8) against physical RAM/VRAM with a 2.0 GB OS and KV-cache safety buffer.
  4. **Multi-Objective Pareto Optimization**: Balances quality, latency, monetary cost, and environmental sustainability (carbon and water footprint).
  5. **Explainability Engine**: Displays why the winning model was selected and why alternative models were rejected.

### 2. Live Groq LPU Frontier Acceleration
- Built-in zero-latency cloud streaming through Groq LPUs (Language Processing Units):
  - **OpenAI GPT-OSS 20B**: 20.2B parameter open reasoning and coding model running at 450+ tokens/sec.
  - **OpenAI GPT-OSS 120B**: 120B flagship model delivering GPT-4 tier depth at ultra-fast speeds.
  - **Qwen 3.8 27B**: 27B bilingual foundation model tuned for code and structured mathematical synthesis.
- Secure serverless routing (`/api/groq/chat`) with streaming reasoning trace support.

### 3. Model Explorer & Registry
- Comprehensive registry covering **Qwen 2.5**, **Llama 3.3/3.2/3.1**, **Mistral NeMo**, **DeepSeek R1/V3**, **Gemma 2**, **Phi-4**, and frontier cloud engines (**Claude 3.5 Sonnet**, **GPT-4o**, **Gemini 1.5 Pro**).
- Multi-dimensional filtering by parameter size, family, licensing, hardware tier, and context window length.
- Detailed modal displaying architecture, benchmark scores (HumanEval, MMLU, GSM8K, MATH500, GPQA), and one-click copyable Ollama pull/run commands.

### 4. Local AI Studio & Hardware Profiler
- **Hardware Detection**: Client-side inspection of OS, logical CPU cores, approximate RAM, and WebGPU readiness.
- **Manual Hardware Overrides**: Custom RAM, VRAM, and storage adjustment for compatibility verification.
- **Local Ollama Daemon**: Automatic live detection at `http://localhost:11434` with CORS troubleshooting guides.
- **Google Colab Bridge**: Pre-configured remote GPU setup notebook with automated verification and teardown.

### 5. Multi-Path AI Workspace
- Conversational chat console with multi-turn conversation history stored in local storage.
- Real-time streaming from Groq LPU cloud endpoints and local Ollama instances.
- Telemetry badges on every response: Model, Execution Location, Latency (ms), Generation Speed (tok/s), Cost ($0.00 for local/free models), Energy (Wh), Water Footprint (mL), and Sovereignty Status.

### 6. Model Benchmark Lab
- Interactive 3-way multi-model radar and bar matrix:
  - **Capability Radar**: Coding, Reasoning, Math, Knowledge, Instruction, Tool Calling.
  - **Standardized Benchmarks**: HumanEval, MMLU, GSM8K, MATH 500, GPQA.
  - **Efficiency & Water Metrics**: Latency (ms), RAM footprint (GB), and Water Footprint (mL/1k tokens).

### 7. Aqua Metrics (Green AI Telemetry)
- Compute energy (kWh), carbon intensity (g CO2eq), and water footprints (Liters).
- Documented methodology distinguishing hyperscale evaporative data center cooling (~1.8 L/kWh) from local grid generation consumption (~2.2 L/kWh).
- Clear telemetry labels: `[MEASURED]`, `[ESTIMATED]`, and `[SIMULATED DEMO DATA]`.

### 8. Sovereignty Center & Developer API
- Master Air-Gap toggle (forces 100% offline local-only execution).
- Cloud provider governance (allowlist / blocklist).
- Immutable routing audit logs tracking Request ID, Timestamp, Data Classification, Policy, and Selected Path with zero prompt leakage.
- OpenAPI-compatible endpoints with cURL, Python, and TypeScript code snippets.

---

## Technology Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **UI Library**: React 19, Tailwind CSS v4, Lucide React, Recharts
- **Offline / PWA**: Native Service Worker (`/public/sw.js`), Web App Manifest (`/public/manifest.webmanifest`)
- **APIs & Inference**: Groq Cloud LPU SDK / REST API, Local Ollama REST API
- **Deployment**: Netlify via `netlify.toml` and `@netlify/plugin-nextjs`

---

## Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/shravanshidruk16/Aqua-Route-Sovereign-AI.git
cd Aqua-Route-Sovereign-AI
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your `GROQ_API_KEY`:
```env
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_GROQ_ENABLED=true
NEXT_PUBLIC_DEFAULT_OLLAMA_HOST=http://localhost:11434
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Netlify Deployment Guide

AquaRoute is pre-configured for one-click deployment on Netlify using the included [`netlify.toml`](./netlify.toml).

### Easy 4-Step Deployment:
1. **Push your repository** to GitHub.
2. **Log in to Netlify** ([netlify.com](https://www.netlify.com)) and click **"Add new site" → "Import an existing project"**.
3. Select **GitHub** and pick `Aqua-Route-Sovereign-AI`.
4. Netlify will auto-detect settings from `netlify.toml`:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`
   - **Plugin**: `@netlify/plugin-nextjs`
5. In **Site Configuration → Environment Variables**, add your keys:
   - `GROQ_API_KEY` = `your_groq_api_key`
   - `NEXT_PUBLIC_GROQ_ENABLED` = `true`
6. Click **"Deploy site"**! Your application will be live in under 2 minutes.

---

## PWA Installation

AquaRoute is a Progressive Web App (PWA):
- **Desktop (Chrome / Edge / Brave)**: Click the **"Install App"** button in the top navbar or the install icon in the URL bar.
- **macOS Safari**: Click **File → Add to Dock...**
- **Android**: Tap **Menu (⋮) → Install App** or **Add to Home screen**.
- **iOS Safari**: Tap **Share → Add to Home Screen**.

---

## License

This project is licensed under the [MIT License](./LICENSE).
