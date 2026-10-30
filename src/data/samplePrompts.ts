import { SensitivityLevel, TaskCategory } from '@/types';

export interface SampleTaskPrompt {
  id: string;
  title: string;
  prompt: string;
  category: TaskCategory;
  defaultSensitivity: SensitivityLevel;
  iconName: string;
  expectedPath: 'LOCAL_MODEL' | 'CLOUD_MODEL' | 'AGENT_WORKFLOW';
}

export const SAMPLE_PROMPTS: SampleTaskPrompt[] = [
  {
    id: 'p-1',
    title: 'Analyze a Confidential PDF',
    prompt: 'Review this internal NDA agreement, identify indemnification obligations, audit liability caps, and extract all expiration milestones without transmitting any text to cloud servers.',
    category: 'Document Analysis',
    defaultSensitivity: 'CONFIDENTIAL',
    iconName: 'ShieldAlert',
    expectedPath: 'LOCAL_MODEL',
  },
  {
    id: 'p-2',
    title: 'Write & Debug Python Code',
    prompt: 'Optimize an async Python FastAPI microservice that processes streaming WebSocket connections, fix memory leaks under heavy load, and write pytest unit tests with 95% branch coverage.',
    category: 'Coding',
    defaultSensitivity: 'INTERNAL',
    iconName: 'Code',
    expectedPath: 'LOCAL_MODEL',
  },
  {
    id: 'p-3',
    title: 'Complex Multi-step Reasoning',
    prompt: 'Solve a multi-variable optimization problem with non-linear constraints: balance latency vs throughput in a distributed vector search cluster while minimizing memory footprint.',
    category: 'Reasoning',
    defaultSensitivity: 'PUBLIC',
    iconName: 'Brain',
    expectedPath: 'LOCAL_MODEL',
  },
  {
    id: 'p-4',
    title: 'Research a Technical Topic',
    prompt: 'Conduct a deep comparative investigation into speculative decoding vs Medusa multi-head inference algorithms. Include benchmark citations and hardware memory bandwidth implications.',
    category: 'Research',
    defaultSensitivity: 'PUBLIC',
    iconName: 'BookOpen',
    expectedPath: 'CLOUD_MODEL',
  },
  {
    id: 'p-5',
    title: 'Summarize 100 Documents',
    prompt: 'Ingest 100 quarterly earnings call transcripts, extract key performance trends, EBITDA margins, and forward-looking guidance into a structured comparative Markdown table.',
    category: 'Document Analysis',
    defaultSensitivity: 'INTERNAL',
    iconName: 'Files',
    expectedPath: 'CLOUD_MODEL',
  },
  {
    id: 'p-6',
    title: 'Generate an Excel Report',
    prompt: 'Write a Python script using openpyxl to parse our customer churn SQLite database, compute retention cohorts, and generate a styled multi-sheet financial workbook with KPI charts.',
    category: 'Coding',
    defaultSensitivity: 'INTERNAL',
    iconName: 'FileSpreadsheet',
    expectedPath: 'AGENT_WORKFLOW',
  },
  {
    id: 'p-7',
    title: 'Run an AI Agent Locally',
    prompt: 'Deploy an autonomous agent in a sandboxed directory to monitor log files for 500 errors, deduplicate stack traces, and summarize root causes into a daily markdown brief.',
    category: 'Agentic Tool Use',
    defaultSensitivity: 'HIGHLY_SENSITIVE',
    iconName: 'Bot',
    expectedPath: 'AGENT_WORKFLOW',
  },
  {
    id: 'p-8',
    title: 'Analyze High-Resolution Image',
    prompt: 'Inspect this architectural blueprint image, measure spatial clearance between server racks and HVAC conduits, and flag any building safety code discrepancies.',
    category: 'Vision',
    defaultSensitivity: 'INTERNAL',
    iconName: 'Eye',
    expectedPath: 'CLOUD_MODEL',
  },
  {
    id: 'p-9',
    title: 'Build a Modern Web Application',
    prompt: 'Architect a responsive Next.js web application with Tailwind CSS, TypeScript, and state management for an IoT solar telemetry dashboard.',
    category: 'Coding',
    defaultSensitivity: 'PUBLIC',
    iconName: 'Globe',
    expectedPath: 'LOCAL_MODEL',
  },
];
