'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, AppView } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { MoreBottomSheet } from '@/components/layout/MoreBottomSheet';
import { PwaInstallModal } from '@/components/layout/PwaInstallBanner';
import { OfflineNotice } from '@/components/layout/OfflineNotice';
import { ExternalRedirectModal } from '@/components/common/ExternalRedirectModal';
import { LandingPage } from '@/components/landing/LandingPage';
import { HomeDashboard } from '@/components/dashboard/HomeDashboard';
import { AiNavigator } from '@/components/navigator/AiNavigator';
import { ModelExplorer } from '@/components/models/ModelExplorer';
import { LocalAiStudio } from '@/components/local-ai/LocalAiStudio';
import { AiWorkspace } from '@/components/workspace/AiWorkspace';
import { AgentHub } from '@/components/agents/AgentHub';
import { BenchmarkLab } from '@/components/benchmarks/BenchmarkLab';
import { AquaMetrics } from '@/components/metrics/AquaMetrics';
import { SovereigntyCenter } from '@/components/sovereignty/SovereigntyCenter';
import { DeveloperCenter } from '@/components/developer/DeveloperCenter';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { DocumentationView } from '@/components/docs/DocumentationView';
import { ModelDetailModal } from '@/components/models/ModelDetailModal';
import { InstallModelModal } from '@/components/local-ai/InstallModelModal';

import { HardwareProfile, Model, SensitivityLevel, OnlineProvider } from '@/types';
import { 
  detectSystemHardware, 
  DEFAULT_FALLBACK_HARDWARE 
} from '@/lib/hardwareDetector';
import { checkOllamaConnection } from '@/lib/ollamaClient';
import { ONLINE_PROVIDERS } from '@/data/providersData';

export default function AquaRouteApp() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [canPromptNative, setCanPromptNative] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);

  // System State
  const [hardware, setHardware] = useState<HardwareProfile>(DEFAULT_FALLBACK_HARDWARE);
  const [ollamaConnected, setOllamaConnected] = useState(false);

  // Cross-component modals
  const [activeModelForDetails, setActiveModelForDetails] = useState<Model | null>(null);
  const [activeModelForInstall, setActiveModelForInstall] = useState<Model | null>(null);
  const [redirectProvider, setRedirectProvider] = useState<OnlineProvider | null>(null);
  const [redirectPrompt, setRedirectPrompt] = useState<string>('');
  const [preselectedWorkspaceModel, setPreselectedWorkspaceModel] = useState<Model | null>(null);

  // Initialize Hardware & Ollama on mount
  useEffect(() => {
    // 1. Detect Hardware
    detectSystemHardware().then((hw) => {
      setHardware(hw);
    });

    // 2. Check Ollama Local Connection
    checkOllamaConnection().then((res) => {
      setOllamaConnected(res.isConnected);
    });

    // 3. Register Service Worker for PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('ServiceWorker registration error:', err);
      });
    }

    // 4. Listen for PWA beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanPromptNative(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 5. Network online/offline detection
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 6. Check URL query params for view (e.g. from PWA shortcut)
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view') as AppView;
    if (viewParam) {
      setCurrentView(viewParam);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTriggerNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setCanPromptNative(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleLaunchTaskFromDashboard = (promptText: string, sensitivity: SensitivityLevel) => {
    setCurrentView('navigator');
  };

  const handleOpenCloudRedirect = (providerId: string, promptText: string) => {
    const prov = ONLINE_PROVIDERS.find((p) => p.id === providerId) || ONLINE_PROVIDERS[0];
    setRedirectProvider(prov);
    setRedirectPrompt(promptText);
  };

  const handleOpenWorkspaceWithModel = (model: Model) => {
    setPreselectedWorkspaceModel(model);
    setCurrentView('workspace');
  };

  const handleRefreshOllama = async () => {
    const res = await checkOllamaConnection();
    setOllamaConnected(res.isConnected);
  };

  const handleResetHardware = async () => {
    localStorage.removeItem('aquaroute_custom_hardware_profile');
    const hw = await detectSystemHardware();
    setHardware(hw);
  };

  // If user selected 'landing', show full Landing Page experience
  if (currentView === 'landing') {
    return (
      <LandingPage
        onNavigate={(view) => setCurrentView(view)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FB] text-[#111318]">
      {/* Desktop Collapsible Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        ollamaConnected={ollamaConnected}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Offline Banner */}
        <OfflineNotice isOnline={isOnline} />

        {/* Top Navbar */}
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          hardware={hardware}
          ollamaConnected={ollamaConnected}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          isInstallable={canPromptNative}
          isOnline={isOnline}
        />

        {/* View Container with bottom safe-area padding for mobile navigation */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
          {currentView === 'dashboard' && (
            <HomeDashboard
              hardware={hardware}
              ollamaConnected={ollamaConnected}
              onNavigate={(v) => setCurrentView(v)}
              onLaunchTaskWithPrompt={handleLaunchTaskFromDashboard}
              onOpenModelDetails={(m) => setActiveModelForDetails(m)}
            />
          )}

          {currentView === 'navigator' && (
            <AiNavigator
              hardware={hardware}
              ollamaConnected={ollamaConnected}
              onInstallModel={(m) => setActiveModelForInstall(m)}
              onOpenLocalAi={() => setCurrentView('local-ai')}
              onOpenWorkspace={handleOpenWorkspaceWithModel}
              onOpenCloudRedirect={handleOpenCloudRedirect}
              onOpenModelDetails={(m) => setActiveModelForDetails(m)}
            />
          )}

          {currentView === 'models' && (
            <ModelExplorer
              hardware={hardware}
              onInstallModel={(m) => setActiveModelForInstall(m)}
              onOpenWorkspace={handleOpenWorkspaceWithModel}
            />
          )}

          {currentView === 'local-ai' && (
            <LocalAiStudio
              hardware={hardware}
              onUpdateHardware={(hw) => setHardware(hw)}
              ollamaConnected={ollamaConnected}
              onRefreshOllama={handleRefreshOllama}
              onOpenWorkspaceWithModel={handleOpenWorkspaceWithModel}
            />
          )}

          {currentView === 'workspace' && (
            <AiWorkspace
              hardware={hardware}
              ollamaConnected={ollamaConnected}
              preselectedModel={preselectedWorkspaceModel}
              onOpenLocalAi={() => setCurrentView('local-ai')}
            />
          )}

          {currentView === 'agents' && <AgentHub />}

          {currentView === 'benchmarks' && (
            <BenchmarkLab
              hardware={hardware}
              onSelectModelForWorkspace={handleOpenWorkspaceWithModel}
              onInstallModel={(m) => setActiveModelForInstall(m)}
            />
          )}

          {currentView === 'metrics' && <AquaMetrics />}

          {currentView === 'usage' && <AquaMetrics />}

          {currentView === 'sovereignty' && <SovereigntyCenter />}

          {(currentView === 'developer' || currentView === 'api-keys') && (
            <DeveloperCenter hardware={hardware} />
          )}

          {currentView === 'docs' && <DocumentationView />}

          {currentView === 'settings' && (
            <SettingsModal
              hardware={hardware}
              onResetHardware={handleResetHardware}
              onRefreshOllama={handleRefreshOllama}
            />
          )}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenMore={() => setIsMoreOpen(true)}
        isMoreOpen={isMoreOpen}
      />

      {/* Mobile More Bottom Sheet */}
      <MoreBottomSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        onNavigate={(view) => setCurrentView(view)}
        currentView={currentView}
      />

      {/* Cross-Cutting Modals */}
      <PwaInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        canPromptNative={canPromptNative}
        onTriggerNativePrompt={handleTriggerNativeInstall}
      />

      <ExternalRedirectModal
        isOpen={Boolean(redirectProvider)}
        onClose={() => setRedirectProvider(null)}
        provider={redirectProvider}
        userPromptText={redirectPrompt}
      />

      <ModelDetailModal
        model={activeModelForDetails}
        isOpen={Boolean(activeModelForDetails)}
        onClose={() => setActiveModelForDetails(null)}
        hardware={hardware}
        onInstallClick={(m) => setActiveModelForInstall(m)}
      />

      <InstallModelModal
        model={activeModelForInstall}
        isOpen={Boolean(activeModelForInstall)}
        onClose={() => setActiveModelForInstall(null)}
        hardware={hardware}
        ollamaConnected={ollamaConnected}
        onOpenWorkspace={() => {
          if (activeModelForInstall) {
            handleOpenWorkspaceWithModel(activeModelForInstall);
          }
        }}
      />
    </div>
  );
}
