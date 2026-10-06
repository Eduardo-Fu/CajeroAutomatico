import React from 'react';
import {
  Laptop,
  CheckCircle,
  HelpCircle,
  Terminal,
  Settings,
  Layers,
  AlertTriangle,
  FolderTree
} from 'lucide-react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Laptop className="w-5 h-5 text-amber-400" />
          <span>Guía de Configuración y Ejecución en Visual Studio</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Paso a paso para compilar la solución <code>Cajero.sln</code> y conectar Microsoft SQL Server en tu máquina Windows.
        </p>
      </div>

      {/* Step by step cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-400 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="text-sm font-bold text-white">Requisitos de Software</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li><strong>Visual Studio 2019 o 2022</strong> (Community / Professional).</li>
            <li>Carga de trabajo: <strong>Desarrollo de escritorio de .NET</strong>.</li>
            <li>Destino del framework: <strong>.NET Framework 4.8</strong>.</li>
            <li><strong>Microsoft SQL Server 2019/2022 Express</strong> instalado localmente.</li>
            <li><strong>SQL Server Management Studio (SSMS)</strong>.</li>
          </ul>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/30 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="text-sm font-bold text-white">Ejecutar el Script SQL</h3>
          </div>
          <p className="text-xs text-slate-400">
            Abre SSMS, conéctate a tu servidor (por ejemplo <code>.\SQLEXPRESS</code> o <code>localhost</code>) y ejecuta el archivo:
          </p>
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-amber-300">
            Cajero/SQLQueryProyecto.sql
          </div>
          <p className="text-[11px] text-slate-400">
            Esto creará la base de datos <code>registro</code> y poblará los usuarios iniciales (Eduardo, Daniella, Lalo).
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="text-sm font-bold text-white">Configurar Cadena de Conexión</h3>
          </div>
          <p className="text-xs text-slate-400">
            En el archivo <code>Cajero/Cajero/App.config</code>, sustituye el nombre del servidor por el tuyo:
          </p>
          <pre className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto">
{`<connectionStrings>
  <add name="Cajero.Properties.Settings.registroConnectionString"
       connectionString="Data Source=TU_SERVIDOR\\SQLEXPRESS;Initial Catalog=registro;Integrated Security=True"
       providerName="System.Data.SqlClient" />
</connectionStrings>`}
          </pre>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/30 border border-purple-500/40 text-purple-400 font-bold text-xs flex items-center justify-center">
              4
            </div>
            <h3 className="text-sm font-bold text-white">Compilar y Ejecutar</h3>
          </div>
          <p className="text-xs text-slate-400">
            Abre <code>Cajero.sln</code> en Visual Studio:
          </p>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>• Haz clic en <strong>Compilar Solución</strong> (Ctrl+Shift+B).</li>
            <li>• Presiona <strong>F5</strong> o haz clic en <strong>Iniciar</strong>.</li>
            <li>• Se abrirá <code>Form1</code> listo para autenticar.</li>
          </ul>
        </div>
      </div>

      {/* Troubleshooting notice */}
      <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/90 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300">Solución de problemas comunes con LINQ to SQL:</strong>
          <p className="mt-1 text-slate-300">
            Si Visual Studio muestra un error al compilar <code>Registro.dbml</code>, abre el diseñador DBML dentro de Visual Studio, verifica que la cadena apunte a tu base de datos local y vuelve a compilar para regenerar <code>Registro.designer.cs</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
