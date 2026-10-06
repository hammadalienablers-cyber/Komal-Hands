import React from 'react';
import { Database, AlertTriangle, RefreshCw, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';

export const UnconfiguredStoreScreen: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* Brand Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-800" />
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Komal Accessories
          </span>
        </div>
        <span className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
          Production Environment
        </span>
      </header>

      {/* Main Alert Card */}
      <main className="max-w-2xl mx-auto w-full my-12 bg-white rounded-3xl shadow-xl border border-stone-200/90 overflow-hidden">
        
        {/* Top Warning Banner */}
        <div className="bg-rose-900 text-rose-50 px-6 sm:px-8 py-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <ShieldAlert className="w-6 h-6 text-rose-200" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-rose-200 font-semibold block">
              Configuration Required
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-semibold text-white">
              Store Backend is Not Configured
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm text-stone-600 leading-relaxed">
            This production build of <strong>Komal Accessories</strong> requires an active, connected <strong>Supabase</strong> PostgreSQL database to store products, process payments, and record customer orders. Silent demo mode is disabled in production to protect real customer orders.
          </p>

          {/* Missing Keys Box */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-700">
              <Database className="w-4 h-4 text-rose-800" />
              <span>Required Environment Secrets</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                <span className="font-semibold text-stone-800">VITE_SUPABASE_URL</span>
                <span className="text-rose-700 font-sans font-medium text-[11px]">Missing or invalid</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
                <span className="font-semibold text-stone-800">VITE_SUPABASE_ANON_KEY</span>
                <span className="text-rose-700 font-sans font-medium text-[11px]">Missing or invalid</span>
              </div>
            </div>
          </div>

          {/* Setup Guide Callout */}
          <div className="space-y-2 text-xs text-stone-600">
            <p className="font-semibold text-stone-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>How to connect your database:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
              <li>
                Run <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-800 font-mono">supabase/schema.sql</code> in your Supabase project SQL Editor.
              </li>
              <li>
                Add <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> to your GitHub Repository Secrets (for GitHub Actions) or host environment.
              </li>
              <li>
                Trigger a rebuild or redeployment.
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-rose-800 hover:text-rose-950 font-medium inline-flex items-center gap-1 underline underline-offset-4"
            >
              <span>Open Supabase Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleReload}
              className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-stone-400 py-4">
        <p>Komal Accessories · Premium Boutique Storefront</p>
      </footer>
    </div>
  );
};
