'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  ShieldAlert, 
  CheckCircle2, 
  Terminal, 
  AlertTriangle, 
  Play, 
  X, 
  Cpu, 
  FolderLock, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AgentWorkflow } from '@/types';
import { AGENT_CATALOGUE } from '@/data/agentsData';

export const AgentHub: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentWorkflow | null>(null);
  const [approvalModalAction, setApprovalModalAction] = useState<string | null>(null);
  const [simulatedExecutionLogs, setSimulatedExecutionLogs] = useState<string[]>([]);
  const [isExecutingWorkflow, setIsExecutingWorkflow] = useState(false);

  const handleLaunchWorkflow = (agent: AgentWorkflow) => {
    setSelectedAgent(agent);
    setIsExecutingWorkflow(true);
    setSimulatedExecutionLogs([
      `[Workflow Started] Initializing ${agent.name} runtime...`,
      `[Policy Gate] Enforcing '${agent.permissionLevel}' guardrails...`,
      `[Environment] Sandboxed at /var/aquaroute/sandbox/${agent.id}...`,
      `[Model Allocated] Mounting target: ${agent.modelRequirements}...`,
      `[Tool Registry] Loaded: ${agent.availableTools.join(', ')}...`,
    ]);

    // Check if permission requires human approval
    if (agent.permissionLevel.includes('Approval') || agent.permissionLevel.includes('Sensitivity')) {
      setTimeout(() => {
        setApprovalModalAction(
          agent.id === 'computer-agent'
            ? 'Execute local filesystem operation: Move 14 old log files to archive directory'
            : agent.id === 'coding-agent'
            ? 'Apply git unified diff to repository file: src/api/router.py'
            : 'Execute external API webhook payload verification'
        );
      }, 1200);
    } else {
      setTimeout(() => {
        setSimulatedExecutionLogs((prev) => [
          ...prev,
          `[Execution] Running sandboxed read-only tools...`,
          `[Result Verification] AST parsed and audited cleanly.`,
          `[Completed] Audit record written to Sovereign Ledger.`,
        ]);
        setIsExecutingWorkflow(false);
      }, 2000);
    }
  };

  const handleApproveAction = () => {
    setApprovalModalAction(null);
    setSimulatedExecutionLogs((prev) => [
      ...prev,
      `[HUMAN APPROVAL GRANTED] User authenticated high-risk execution.`,
      `[Sandbox Applied] Changes staged and verified within container.`,
      `[Audit Record] Transaction signed and recorded.`,
      `[Status] Workflow execution successful.`,
    ]);
    setIsExecutingWorkflow(false);
  };

  const handleRejectAction = () => {
    setApprovalModalAction(null);
    setSimulatedExecutionLogs((prev) => [
      ...prev,
      `[HUMAN REJECTION] User aborted operation. Execution halted safely.`,
      `[Rollback] Sandbox state restored to original snapshot.`,
    ]);
    setIsExecutingWorkflow(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
          <Bot size={13} className="text-[#0D9488]" />
          <span>Autonomous Agent Runtime Adapters</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight">
          Agent Hub
        </h1>
        <p className="text-xs sm:text-sm text-[#717784] max-w-2xl leading-relaxed">
          Deploy specialized autonomous agents across local sandboxes and hybrid private environments. Every risky action enforces strict human-in-the-loop approval.
        </p>
      </div>

      {/* Visual Agent Lifecycle Pipeline */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#717784]">
          Deterministic Agent Execution Workflow
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
          {[
            { step: '1', title: 'Task Input' },
            { step: '2', title: 'Task Analysis' },
            { step: '3', title: 'Policy Check' },
            { step: '4', title: 'Model Select' },
            { step: '5', title: 'Tool Bound' },
            { step: '6', title: 'Execution' },
            { step: '7', title: 'Approval Gate', highlight: true },
            { step: '8', title: 'Audit Ledger' },
          ].map((item) => (
            <div
              key={item.step}
              className={`p-2.5 rounded-2xl border transition-all ${
                item.highlight
                  ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                  : 'bg-[#F8F9FB] border-[#E2E8F0] text-[#334155]'
              }`}
            >
              <span className="text-[10px] text-[#717784] block font-semibold">Step {item.step}</span>
              <span className="text-xs mt-0.5 block">{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENT_CATALOGUE.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-3xl p-5 border border-[#E2E8F0] hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {agent.archetype}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                  agent.permissionLevel.includes('Approval') ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {agent.permissionLevel}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#111318]">{agent.name}</h3>
              <p className="text-xs text-[#475569] mt-2 line-clamp-3 leading-relaxed">
                {agent.description}
              </p>

              {/* Tools Badges */}
              <div className="mt-3 space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#717784] block">
                  Available Tools
                </span>
                <div className="flex flex-wrap gap-1">
                  {agent.availableTools.map((t, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#F1F4F8] text-[#334155]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-[11px] text-[#717784]">
                <span>Requires: </span>
                <span className="font-semibold text-slate-800">{agent.modelRequirements}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F4F8] flex items-center justify-between">
              <span className="text-xs text-[#717784] font-medium">
                {agent.executionLocation}
              </span>

              <button
                onClick={() => handleLaunchWorkflow(agent)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#111318] text-white hover:bg-black flex items-center gap-1.5 shadow-2xs"
              >
                <Play size={12} />
                Test Agent
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Execution Console Drawer */}
      {selectedAgent && (
        <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Terminal size={18} className="text-teal-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Agent Execution Console: {selectedAgent.name}
                </h3>
                <span className="text-[11px] text-slate-400">
                  Sandboxed Container • Policy: {selectedAgent.permissionLevel}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedAgent(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close Console
            </button>
          </div>

          <div className="font-mono text-xs text-teal-300 space-y-1 bg-slate-950 p-4 rounded-2xl max-h-56 overflow-y-auto border border-slate-800">
            {simulatedExecutionLogs.map((log, index) => (
              <div key={index} className="leading-relaxed">
                {log}
              </div>
            ))}
            {isExecutingWorkflow && !approvalModalAction && (
              <div className="text-slate-400 animate-pulse">Running step...</div>
            )}
          </div>
        </div>
      )}

      {/* Human-in-the-Loop Explicit Approval Modal */}
      {approvalModalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/65 backdrop-blur-xs" onClick={handleRejectAction} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-300 z-10 animate-scale-up space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111318]">Human Approval Required</h3>
                <p className="text-xs text-[#717784] mt-0.5">High-risk agent action intercepted by guardrail</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 font-mono">
              {approvalModalAction}
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              Under AquaRoute Sovereignty guidelines, autonomous agents cannot modify files or call external networks without explicit human consent.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={handleRejectAction}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Deny Action
              </button>
              <button
                onClick={handleApproveAction}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                Authorize Execution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
