import React, { useState, useEffect } from 'react';
import { FirebaseAppConfig } from '../types/calendar';
import {
  getSavedFirebaseConfig,
  saveFirebaseConfig,
  testFirestoreConnection,
  syncToFirestoreDatabase,
  exportCalendarDataJSON,
} from '../services/firebase';
import {
  Database,
  X,
  CheckCircle2,
  AlertTriangle,
  Download,
  UploadCloud,
  Check,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface FirebaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const FirebaseSyncModal: React.FC<FirebaseSyncModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');

  const [testStatus, setTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({
    loading: false,
  });

  const [syncStatus, setSyncStatus] = useState<{
    inProgress: boolean;
    progress: number;
    message: string;
    success?: boolean;
    error?: string;
  }>({
    inProgress: false,
    progress: 0,
    message: '',
  });

  useEffect(() => {
    if (isOpen) {
      const saved = getSavedFirebaseConfig();
      if (saved) {
        setApiKey(saved.apiKey || '');
        setAuthDomain(saved.authDomain || '');
        setProjectId(saved.projectId || '');
        setStorageBucket(saved.storageBucket || '');
        setMessagingSenderId(saved.messagingSenderId || '');
        setAppId(saved.appId || '');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    const config: FirebaseAppConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    saveFirebaseConfig(config);
    onConfigChanged();
    setTestStatus({
      loading: false,
      success: true,
      message: 'Configuratie lokaal opgeslagen!',
    });
  };

  const handleTestConnection = async () => {
    setTestStatus({ loading: true });
    const config: FirebaseAppConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    const res = await testFirestoreConnection(config);
    setTestStatus({
      loading: false,
      success: res.success,
      message: res.message,
    });
  };

  const handleSyncToFirestore = async () => {
    handleSaveConfig();
    setSyncStatus({
      inProgress: true,
      progress: 5,
      message: 'Starten van synchronisatie voor 1926 — 2056...',
    });

    const res = await syncToFirestoreDatabase((pct, msg) => {
      setSyncStatus({
        inProgress: true,
        progress: pct,
        message: msg,
      });
    });

    setSyncStatus({
      inProgress: false,
      progress: 100,
      message: res.message,
      success: res.success,
      error: res.success ? undefined : res.message,
    });
  };

  const handleExportJSON = () => {
    exportCalendarDataJSON(1926, 2056);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-100">
                Firebase Database & Cloud Synchronisatie
              </h3>
              <p className="text-xs text-amber-300 font-mono">
                130 Jaar Dataset: 1926 (100j verleden) — 2056 (30j toekomst)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs">
          
          {/* Explanation Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-amber-400" />
              <span>Wat wordt er opgeslagen in Firebase Firestore?</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              De database bevat alle fasenamen, tekens en events voor de 6 kalendersystemen over een periode van 130 jaar:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300">
                📁 <strong>calendar_systems</strong>: Volledige definities en fasenamen
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-300">
                📁 <strong>calendar_metadata</strong>: Tijdspanne 1926-2056 & GMT correlaties
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-purple-300">
                📁 <strong>calendar_events</strong>: Essenen feesten, Sabbats, Tzolk'in golven, Haab
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                📁 <strong>user_events</strong>: Uw eigen gekoppelde notities en afspraken
              </div>
            </div>
          </div>

          {/* Direct JSON Export Card */}
          <div className="bg-gradient-to-r from-indigo-950/50 to-slate-950 border border-indigo-800/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div>
              <div className="font-bold text-indigo-200 text-sm flex items-center gap-1.5">
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Download Complete Database als JSON (130 Jaar)</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Download direct het geformatteerde JSON-bestand (1926-2056) met alle fasenamen, events en metadata.
              </p>
            </div>

            <button
              onClick={handleExportJSON}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-2 shrink-0 shadow-md shadow-indigo-600/30"
            >
              <Download className="w-4 h-4" />
              Download JSON
            </button>
          </div>

          {/* Firebase Configuration Inputs */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-200">
                Firebase Web App Project Configuratie
              </h4>
              <span className="text-[10px] text-slate-400">
                Verkrijgbaar in Firebase Console &gt; Project Settings
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  apiKey *
                </label>
                <input
                  type="text"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  projectId *
                </label>
                <input
                  type="text"
                  placeholder="universele-kalender-123"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  authDomain
                </label>
                <input
                  type="text"
                  placeholder="universele-kalender.firebaseapp.com"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  appId
                </label>
                <input
                  type="text"
                  placeholder="1:123456789:web:abcdef"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Test Connection Result */}
            {testStatus.message && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2 ${
                  testStatus.success
                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-700 text-rose-300'
                }`}
              >
                {testStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{testStatus.message}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
                >
                  Opslaan
                </button>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={!apiKey || !projectId || testStatus.loading}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold transition flex items-center gap-1.5"
                >
                  {testStatus.loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Test Firestore Verbinding</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSyncToFirestore}
                disabled={!apiKey || !projectId || syncStatus.inProgress}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-600/30"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Synchroniseer 130 Jaar naar Firestore</span>
              </button>
            </div>
          </div>

          {/* Sync Progress Bar */}
          {syncStatus.inProgress && (
            <div className="bg-slate-950 border border-amber-800/60 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synchroniseren met Firestore...</span>
                </span>
                <span className="font-mono font-bold text-slate-200">{syncStatus.progress}%</span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${syncStatus.progress}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 font-mono truncate">{syncStatus.message}</p>
            </div>
          )}

          {/* Sync completed message */}
          {!syncStatus.inProgress && syncStatus.message && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2.5 ${
                syncStatus.success
                  ? 'bg-emerald-950/70 border-emerald-600 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-600 text-rose-200'
              }`}
            >
              {syncStatus.success ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
              )}
              <span className="text-xs">{syncStatus.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
