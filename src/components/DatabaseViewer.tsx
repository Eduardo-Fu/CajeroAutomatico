import React, { useState } from 'react';
import { Cliente, RetiroRegistro, DepositoRegistro } from '../types/cajero';
import { INITIAL_CLIENTS, INITIAL_RETIROS, INITIAL_DEPOSITOS, SQL_SCRIPT } from '../data/initialData';
import {
  Database,
  FileSpreadsheet,
  Download,
  RotateCcw,
  Unlock,
  PlusCircle,
  Copy,
  Check,
  Code2,
  TableProperties
} from 'lucide-react';

interface DatabaseViewerProps {
  clientes: Cliente[];
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>;
  retiros: RetiroRegistro[];
  setRetiros: React.Dispatch<React.SetStateAction<RetiroRegistro[]>>;
  depositos: DepositoRegistro[];
  setDepositos: React.Dispatch<React.SetStateAction<DepositoRegistro[]>>;
}

export const DatabaseViewer: React.FC<DatabaseViewerProps> = ({
  clientes,
  setClientes,
  retiros,
  setRetiros,
  depositos,
  setDepositos,
}) => {
  const [activeTab, setActiveTab] = useState<'CLIENTES' | 'RETIROS_CSV' | 'DEPOSITOS_CSV' | 'SQL_SCRIPT'>('CLIENTES');
  const [copiedSql, setCopiedSql] = useState(false);

  const handleResetDatabase = () => {
    if (confirm('¿Restablecer la base de datos a los 3 clientes iniciales y logs de prueba?')) {
      setClientes(INITIAL_CLIENTS);
      setRetiros(INITIAL_RETIROS);
      setDepositos(INITIAL_DEPOSITOS);
    }
  };

  const handleUnlockAccount = (codigo: number) => {
    setClientes((prev) =>
      prev.map((c) => (c.codigo === codigo ? { ...c, estado: true } : c))
    );
  };

  const handleAddBalance = (codigo: number, amount: number) => {
    setClientes((prev) =>
      prev.map((c) => (c.codigo === codigo ? { ...c, monto: c.monto + amount } : c))
    );
  };

  const downloadRetirosCsv = () => {
    let content = 'Codigo;Nombre;Apellido;Monto Retirado;Fecha\r\n';
    retiros.forEach((r) => {
      content += `${r.codigo};${r.nombre};${r.apellido};${r.monto};${r.fecha}\r\n`;
    });
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Retiros.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadDepositosCsv = () => {
    let content = 'CodigoDepositante;UsuarioDepositante;CodigoReceptor;UsuarioReceptor;Monto;Fecha\r\n';
    depositos.forEach((d) => {
      content += `${d.codigoDepositante};${d.usuarioDepositante};${d.codigoReceptor};${d.usuarioReceptor};${d.monto};${d.fecha}\r\n`;
    });
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Depositos.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadSqlScript = () => {
    const blob = new Blob([SQL_SCRIPT], { type: 'application/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SQLQueryProyecto.sql';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <span>Explorador de Base de Datos y Logs CSV</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspecciona las tablas de SQL Server y los archivos de auditoría generados por el cajero automático.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sub Navigation */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('CLIENTES')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'CLIENTES' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tabla clientes ({clientes.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('RETIROS_CSV')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'RETIROS_CSV' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Retiros.csv ({retiros.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('DEPOSITOS_CSV')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'DEPOSITOS_CSV' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Depositos.csv ({depositos.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('SQL_SCRIPT')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'SQL_SCRIPT' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              SQL Script
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetDatabase}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            title="Restablecer cuentas a los valores iniciales"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer BD</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CLIENTES TABLE */}
      {activeTab === 'CLIENTES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-amber-300">
              SELECT codigo, nombre, usuario, banco, monto, estado FROM clientes;
            </span>
            <span>Total registros: {clientes.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Código</th>
                  <th className="p-3">Nombre Completo</th>
                  <th className="p-3">Usuario</th>
                  <th className="p-3">DPI / Teléfono</th>
                  <th className="p-3">Banco</th>
                  <th className="p-3 font-mono">Saldo (GTQ)</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones de Prueba</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {clientes.map((c) => (
                  <tr key={c.codigo} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono text-amber-400 font-bold">{c.codigo}</td>
                    <td className="p-3 font-medium text-white">{c.nombre} {c.apellido}</td>
                    <td className="p-3 font-mono text-blue-300">{c.usuario}</td>
                    <td className="p-3 text-[11px] text-slate-400 font-mono">
                      <div>DPI: {c.DPI}</div>
                      <div>Tel: {c.telefono}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {c.banco}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-emerald-400 font-bold text-sm">
                      Q {c.monto.toFixed(2)}
                    </td>
                    <td className="p-3">
                      {c.estado ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          1 (Activo)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          0 (Bloqueado)
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!c.estado && (
                          <button
                            type="button"
                            onClick={() => handleUnlockAccount(c.codigo)}
                            className="px-2 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 rounded text-[10px] font-bold cursor-pointer flex items-center gap-1"
                          >
                            <Unlock className="w-3 h-3" /> Desbloquear
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleAddBalance(c.codigo, 500)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[10px] cursor-pointer"
                        >
                          +Q500
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RETIROS.CSV */}
      {activeTab === 'RETIROS_CSV' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-white">Transacciones/Retiros.csv</span>
              <span className="text-slate-400">({retiros.length} registros)</span>
            </div>
            <button
              type="button"
              onClick={downloadRetirosCsv}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Descargar Retiros.csv
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Codigo</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Apellido</th>
                  <th className="p-3">Monto Retirado</th>
                  <th className="p-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {retiros.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="p-3 text-amber-400">{r.codigo}</td>
                    <td className="p-3 text-white">{r.nombre}</td>
                    <td className="p-3">{r.apellido}</td>
                    <td className="p-3 text-rose-400 font-bold">Q{r.monto}.00</td>
                    <td className="p-3 text-slate-400">{r.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DEPOSITOS.CSV */}
      {activeTab === 'DEPOSITOS_CSV' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-white">Transacciones/Depositos.csv</span>
              <span className="text-slate-400">({depositos.length} registros)</span>
            </div>
            <button
              type="button"
              onClick={downloadDepositosCsv}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Descargar Depositos.csv
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">CodigoDepositante</th>
                  <th className="p-3">UsuarioDepositante</th>
                  <th className="p-3">CodigoReceptor</th>
                  <th className="p-3">UsuarioReceptor</th>
                  <th className="p-3">Monto</th>
                  <th className="p-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {depositos.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="p-3 text-amber-400">{d.codigoDepositante}</td>
                    <td className="p-3 text-white">{d.usuarioDepositante}</td>
                    <td className="p-3 text-amber-400">{d.codigoReceptor}</td>
                    <td className="p-3 text-white">{d.usuarioReceptor}</td>
                    <td className="p-3 text-emerald-400 font-bold">Q{d.monto}.00</td>
                    <td className="p-3 text-slate-400">{d.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SQL SCRIPT */}
      {activeTab === 'SQL_SCRIPT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-white">Cajero/SQLQueryProyecto.sql</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopySql}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copiado' : 'Copiar SQL'}</span>
              </button>
              <button
                type="button"
                onClick={downloadSqlScript}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar SQL</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            {SQL_SCRIPT}
          </pre>
        </div>
      )}
    </div>
  );
};
