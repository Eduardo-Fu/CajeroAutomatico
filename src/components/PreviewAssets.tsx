import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  ExternalLink,
  Code2,
  Sparkles,
  Share2
} from 'lucide-react';

export const PreviewAssets: React.FC = () => {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const embedSnippet = `<!-- Banner de Preview para GitHub README -->
<p align="center">
  <a href="https://ais-pre-yp2ksa6mdvdeieuctagcdp-651500077203.us-east1.run.app">
    <img src="./preview-cajero.svg" alt="Preview Cajero Automático C#" width="100%" />
  </a>
</p>`;

  const liveDemoUrl = 'https://ais-pre-yp2ksa6mdvdeieuctagcdp-651500077203.us-east1.run.app';

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(liveDemoUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleDownloadSvg = () => {
    const link = document.createElement('a');
    link.href = '/preview-cajero.svg';
    link.download = 'preview-cajero.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span>Preview Visual para GitHub</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              GitHub renderiza gráficos vectoriales SVG directamente en el README. Este banner incluye la ficha técnica, estética de WinForms y el botón hacia la demo en vivo.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Download className="w-4 h-4" />
              <span>Descargar preview-cajero.svg</span>
            </button>
            <button
              type="button"
              onClick={handleCopySnippet}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow"
            >
              {copiedSnippet ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSnippet ? '¡Copiado!' : 'Copiar Código de Embed'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Display of preview-cajero.svg */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
          <span className="font-mono text-amber-300">preview-cajero.svg (Resolución nativa: 1200 x 630px)</span>
          <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
            Vector SVG Nítido en Retina & Móvil
          </span>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
          <img
            src="/preview-cajero.svg"
            alt="Preview Cajero Automático C#"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Embed Guide & Live Link Sharing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box 1: Code Embed Snippet */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Código Markdown para insertar en tu README</span>
            </span>
            <button
              type="button"
              onClick={handleCopySnippet}
              className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 cursor-pointer"
            >
              {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copiar</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto">
            {embedSnippet}
          </pre>
          <p className="text-[11px] text-slate-400 mt-2">
            Coloca el archivo <code className="text-amber-300">preview-cajero.svg</code> en la raíz de tu repositorio y sube el commit.
          </p>
        </div>

        {/* Box 2: Live Link Sharing */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>URL de Demostración en Vivo</span>
            </span>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 cursor-pointer"
            >
              {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copiar URL</span>
            </button>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 truncate">
            {liveDemoUrl}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Disponible públicamente para cualquier visitante de GitHub.
            </span>
            <a
              href={liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>Abrir en nueva pestaña</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
