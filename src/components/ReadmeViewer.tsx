import React, { useState } from 'react';
import { README_MARKDOWN } from '../data/initialData';
import {
  Copy,
  Check,
  Download,
  Eye,
  FileCode,
  Terminal,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ReadmeViewer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'PREVIEW' | 'RAW'>('PREVIEW');
  const [copied, setCopied] = useState(false);
  const [copiedGit, setCopiedGit] = useState(false);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(README_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([README_MARKDOWN], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'README.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const gitCommands = `git clone https://github.com/Eduardo-Fu/Cajero.git
cd Cajero
# Descarga o pega el archivo README.md generado
git add README.md preview-cajero.svg
git commit -m "docs: agregar README profesional con preview visual y documentación"
git push origin main`;

  const handleCopyGitCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedGit(true);
    setTimeout(() => setCopiedGit(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar with Action Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>README.md para</span>
            <span className="text-amber-400 font-mono text-base">Eduardo-Fu/Cajero</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Documentación técnica estructurada lista para mostrar en la página principal de GitHub con preview en vivo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('PREVIEW')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'PREVIEW'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Vista Previa GitHub
            </button>
            <button
              type="button"
              onClick={() => setViewMode('RAW')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'RAW'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" /> Código Markdown (Raw)
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar README.md</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownloadReadme}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Descargar .md</span>
          </button>
        </div>
      </div>

      {/* Terminal Command Quick Push Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Comandos Git para subir este README directamente a GitHub:</span>
          </div>
          <button
            type="button"
            onClick={handleCopyGitCommands}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 cursor-pointer"
          >
            {copiedGit ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedGit ? 'Comandos copiados' : 'Copiar comandos'}</span>
          </button>
        </div>
        <pre className="text-xs font-mono text-emerald-300/90 bg-slate-900/90 p-3 rounded-xl overflow-x-auto border border-slate-800">
          {gitCommands}
        </pre>
      </div>

      {/* Content Display: Rendered or Raw */}
      {viewMode === 'RAW' ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800 text-xs text-slate-400">
            <span>README.md (Markdown sin procesar)</span>
            <span>{README_MARKDOWN.split('\n').length} líneas</span>
          </div>
          <textarea
            readOnly
            value={README_MARKDOWN}
            rows={30}
            className="w-full bg-slate-900 text-slate-300 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none resize-y leading-relaxed"
          />
        </div>
      ) : (
        /* Rendered GitHub Styled View */
        <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm max-w-4xl mx-auto font-sans leading-relaxed">
          {/* GitHub Document Header */}
          <div className="text-center pb-8 border-b border-slate-200">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-3">
              <span>🏧 Cajero Automático (ATM) en C# .NET & SQL Server</span>
            </h1>

            {/* Shields.io Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="px-2.5 py-1 rounded bg-[#239120] text-white text-xs font-bold font-mono">
                C#
              </span>
              <span className="px-2.5 py-1 rounded bg-[#512BD4] text-white text-xs font-bold font-mono">
                .NET Framework 4.8
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0078D6] text-white text-xs font-bold font-mono">
                Windows Forms
              </span>
              <span className="px-2.5 py-1 rounded bg-[#CC292B] text-white text-xs font-bold font-mono">
                SQL Server Express
              </span>
              <span className="px-2.5 py-1 rounded bg-[#D97706] text-white text-xs font-bold font-mono">
                MIT License
              </span>
            </div>

            <p className="text-base text-slate-600 mt-4 max-w-2xl mx-auto">
              Aplicación de escritorio desarrollada en C# WinForms conectada a SQL Server para simulación bancaria completa, control de transacciones en quetzales (GTQ), validaciones de seguridad y auditoría en CSV.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-blue-600">
              <a
                href="https://ais-pre-yp2ksa6mdvdeieuctagcdp-651500077203.us-east1.run.app"
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300"
              >
                🚀 Probar Simulador y Preview en Vivo
              </a>
              <span>&bull;</span>
              <a href="#arquitectura" className="hover:underline">📖 Documentación</a>
              <span>&bull;</span>
              <a href="#instalacion" className="hover:underline">🛠️ Instalación</a>
              <span>&bull;</span>
              <a href="#bd" className="hover:underline">🗄️ Base de Datos</a>
            </div>

            {/* Embedded Visual Preview Banner */}
            <div className="mt-8 border border-slate-300 rounded-2xl overflow-hidden shadow-lg bg-slate-900">
              <img
                src="/preview-cajero.svg"
                alt="Preview Cajero Automático C#"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Section: Características */}
          <div className="py-8 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>🌟 Características Principales</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Autenticación y Seguridad</span>
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                  <li>Validación triple: Código, Usuario y Contraseña.</li>
                  <li>Contador de seguridad de hasta 3 intentos fallidos.</li>
                  <li>Bloqueo automático de cuenta en SQL Server al agotar intentos.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-emerald-600 font-mono font-bold">Q</span>
                  <span>Retiro de Efectivo (GTQ)</span>
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                  <li>Denominaciones rápidas: Q50, Q100, Q200, Q400, Q600, Q1000.</li>
                  <li>Retiro personalizado estrictamente en múltiplos de Q50.</li>
                  <li>Tope diario acumulativo de hasta <strong>Q3,000.00 por día</strong>.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-amber-600 font-mono font-bold">📥</span>
                  <span>Depósitos y Transferencias</span>
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                  <li>Depósito a cuenta propia de hasta Q100,000.00.</li>
                  <li>Transferencia a terceros con comprobación previa de código y estado activo.</li>
                  <li>Límite diario a terceros de <strong>Q2,000.00 diarios</strong>.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-indigo-600 font-mono font-bold">📄</span>
                  <span>Auditoría en Archivos CSV</span>
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                  <li><code>Retiros.csv</code>: historial con montos, códigos y fechas.</li>
                  <li><code>Depositos.csv</code>: emisor, receptor, fecha y monto.</li>
                  <li>Persistencia relacional mediante LINQ to SQL (<code>Registro.dbml</code>).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section: Cuentas de Prueba */}
          <div className="py-8 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>👥 Cuentas de Prueba Preconfiguradas</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="p-2.5 border-b">Código</th>
                    <th className="p-2.5 border-b">Usuario</th>
                    <th className="p-2.5 border-b">Contraseña</th>
                    <th className="p-2.5 border-b">DPI</th>
                    <th className="p-2.5 border-b">Banco</th>
                    <th className="p-2.5 border-b">Saldo Inicial</th>
                    <th className="p-2.5 border-b">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-bold font-mono text-blue-700">1000</td>
                    <td className="p-2.5 font-mono">eduardofujeje</td>
                    <td className="p-2.5 font-mono">ciscO@123</td>
                    <td className="p-2.5 font-mono">3023043040101</td>
                    <td className="p-2.5">Industrial</td>
                    <td className="p-2.5 font-bold text-emerald-600">Q 150.00</td>
                    <td className="p-2.5 text-emerald-600 font-bold">✅ Activo</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold font-mono text-blue-700">1001</td>
                    <td className="p-2.5 font-mono">daniellajeje</td>
                    <td className="p-2.5 font-mono">ciscO@123</td>
                    <td className="p-2.5 font-mono">3021675360101</td>
                    <td className="p-2.5">Banrural</td>
                    <td className="p-2.5 font-bold text-emerald-600">Q 1,500.00</td>
                    <td className="p-2.5 text-emerald-600 font-bold">✅ Activo</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold font-mono text-blue-700">1002</td>
                    <td className="p-2.5 font-mono">laloooo1</td>
                    <td className="p-2.5 font-mono">andreA@145</td>
                    <td className="p-2.5 font-mono">3021051570101</td>
                    <td className="p-2.5">Industrial</td>
                    <td className="p-2.5 font-bold text-emerald-600">Q 10,000.00</td>
                    <td className="p-2.5 text-rose-600 font-bold">❌ Bloqueado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Base de Datos */}
          <div id="bd" className="py-8 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>🗄️ Esquema de Base de Datos</span>
            </h2>
            <p className="text-xs text-slate-600 mb-3">
              Ubicado en <code>Cajero/SQLQueryProyecto.sql</code>. Define la base de datos <code>registro</code> y la tabla relacional <code>clientes</code>:
            </p>
            <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`CREATE DATABASE registro;
USE registro;

CREATE TABLE clientes(
    codigo INT PRIMARY KEY IDENTITY(1000,1),
    nombre VARCHAR(30),
    apellido VARCHAR(30),
    fecha_de_nacimiento VARCHAR(30),
    DPI BIGINT,
    correo VARCHAR(50),
    telefono BIGINT,
    usuario VARCHAR(30),
    contraseña VARCHAR(30),
    banco VARCHAR(15),
    monto INT,
    estado BIT
);`}
            </pre>
          </div>

          {/* Section: Instalación */}
          <div id="instalacion" className="py-8 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span>🛠️ Instalación y Configuración</span>
            </h2>

            <ol className="space-y-4 text-sm text-slate-700 list-decimal list-inside">
              <li>
                <strong>Clonar el repositorio:</strong>
                <pre className="mt-1.5 p-3 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-800">
                  git clone https://github.com/Eduardo-Fu/Cajero.git
                </pre>
              </li>
              <li>
                <strong>Crear la base de datos en SQL Server:</strong>
                <p className="text-xs text-slate-600 mt-1">
                  Abre SQL Server Management Studio (SSMS) y ejecuta el script <code>SQLQueryProyecto.sql</code>.
                </p>
              </li>
              <li>
                <strong>Configurar conexión en App.config:</strong>
                <p className="text-xs text-slate-600 mt-1">
                  Ajusta la propiedad <code>Data Source</code> con el nombre de tu servidor local en <code>App.config</code>.
                </p>
              </li>
              <li>
                <strong>Compilar y Ejecutar:</strong>
                <p className="text-xs text-slate-600 mt-1">
                  Abre <code>Cajero.sln</code> en Visual Studio y presiona <code>F5</code>.
                </p>
              </li>
            </ol>
          </div>

          {/* Footer */}
          <div className="pt-6 text-center text-xs text-slate-500">
            Desarrollado por <strong>Eduardo Fu</strong> &bull; Licencia MIT &bull; Repositorio: <a href="https://github.com/Eduardo-Fu/Cajero" target="_blank" rel="noreferrer" className="text-blue-600 underline">github.com/Eduardo-Fu/Cajero</a>
          </div>
        </div>
      )}
    </div>
  );
};
