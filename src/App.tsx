import React, { useState } from 'react';
import { Cliente, RetiroRegistro, DepositoRegistro } from './types/cajero';
import { INITIAL_CLIENTS, INITIAL_RETIROS, INITIAL_DEPOSITOS } from './data/initialData';
import { AtmMockup } from './components/AtmMockup';
import { DatabaseViewer } from './components/DatabaseViewer';
import { SetupGuide } from './components/SetupGuide';
import {
  CreditCard,
  Database,
  Laptop,
  Github,
  ExternalLink,
  Sparkles,
  DollarSign
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'ATM' | 'DATABASE' | 'GUIDE'>('ATM');
  const [clientes, setClientes] = useState<Cliente[]>(INITIAL_CLIENTS);
  const [retiros, setRetiros] = useState<RetiroRegistro[]>(INITIAL_RETIROS);
  const [depositos, setDepositos] = useState<DepositoRegistro[]>(INITIAL_DEPOSITOS);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-900">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-b border-blue-800/40 px-4 py-2 text-xs text-center text-blue-200 flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
          <Sparkles className="w-3.5 h-3.5" /> Repositorio Oficial:
        </span>
        <a
          href="https://github.com/Eduardo-Fu/Cajero"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-white underline hover:text-amber-300 flex items-center gap-1"
        >
          github.com/Eduardo-Fu/Cajero.git <ExternalLink className="w-3 h-3" />
        </a>
        <span className="text-blue-400/80 hidden sm:inline">&bull;</span>
        <span className="text-slate-300 hidden sm:inline">
          Simulador bancario interactivo en Quetzales (GTQ) con lógica de C# Windows Forms y SQL Server
        </span>
      </div>

      {/* Main Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-400/40 flex items-center justify-center text-amber-300 shadow-md">
              <DollarSign className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white tracking-tight">
                  Cajero Automático C#
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold uppercase">
                  WinForms + SQL Server
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulador Web en Vivo &bull; Persistencia de Datos &bull; Auditoría CSV
              </p>
            </div>
          </div>

          {/* GitHub Repo Button */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Eduardo-Fu/Cajero"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-all shadow-sm"
            >
              <Github className="w-4 h-4" />
              <span>Ver en GitHub</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-1 border-t border-slate-800/60 pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('ATM')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'ATM'
                ? 'border-amber-400 text-amber-300 bg-amber-400/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Simulador del Cajero (Live Demo)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DATABASE')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'DATABASE'
                ? 'border-amber-400 text-amber-300 bg-amber-400/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Base de Datos & Logs CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('GUIDE')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'GUIDE'
                ? 'border-amber-400 text-amber-300 bg-amber-400/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Guía Visual Studio</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 sm:py-6 lg:p-8">
        {activeTab === 'ATM' && (
          <AtmMockup
            clientes={clientes}
            setClientes={setClientes}
            retiros={retiros}
            setRetiros={setRetiros}
            depositos={depositos}
            setDepositos={setDepositos}
          />
        )}

        {activeTab === 'DATABASE' && (
          <DatabaseViewer
            clientes={clientes}
            setClientes={setClientes}
            retiros={retiros}
            setRetiros={setRetiros}
            depositos={depositos}
            setDepositos={setDepositos}
          />
        )}

        {activeTab === 'GUIDE' && <SetupGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-slate-200">
              Cajero Automático C# &bull; Proyecto de Eduardo Fu
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Simulador interactivo con persistencia de estado, transacciones en Quetzales y auditoría en CSV.
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('ATM')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Simulador Cajero
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => setActiveTab('DATABASE')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Base de Datos
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => setActiveTab('GUIDE')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Guía Visual Studio
            </button>
            <span>&bull;</span>
            <a
              href="https://github.com/Eduardo-Fu/Cajero"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:text-amber-300 underline"
            >
              Repositorio GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
