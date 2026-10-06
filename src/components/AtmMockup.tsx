import React, { useState } from 'react';
import { Cliente, RetiroRegistro, DepositoRegistro } from '../types/cajero';
import {
  CreditCard,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  RotateCcw,
  Receipt,
  UserPlus,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Printer,
  Sparkles,
  Building2,
  User,
  History,
  FileSpreadsheet
} from 'lucide-react';

interface AtmMockupProps {
  clientes: Cliente[];
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>;
  retiros: RetiroRegistro[];
  setRetiros: React.Dispatch<React.SetStateAction<RetiroRegistro[]>>;
  depositos: DepositoRegistro[];
  setDepositos: React.Dispatch<React.SetStateAction<DepositoRegistro[]>>;
}

type ScreenType = 'LOGIN' | 'MENU' | 'RETIRO' | 'DEPOSITO' | 'CONSULTA' | 'REGISTRO';

export const AtmMockup: React.FC<AtmMockupProps> = ({
  clientes,
  setClientes,
  retiros,
  setRetiros,
  depositos,
  setDepositos,
}) => {
  // Current session state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('LOGIN');
  const [currentUser, setCurrentUser] = useState<Cliente | null>(null);

  // Login inputs & state
  const [loginCodigo, setLoginCodigo] = useState('1000');
  const [loginUsuario, setLoginUsuario] = useState('eduardofujeje');
  const [loginContra, setLoginContra] = useState('ciscO@123');
  const [intentosRestantes, setIntentosRestantes] = useState(3);
  const [lastAttemptCodigo, setLastAttemptCodigo] = useState('');
  const [loginAlert, setLoginAlert] = useState<{ type: 'error' | 'warning' | 'success'; message: string } | null>(null);

  // Retiro state
  const [retiroTab, setRetiroTab] = useState<'PRESETS' | 'CUSTOM' | 'SUCCESS'>('PRESETS');
  const [customRetiroMonto, setCustomRetiroMonto] = useState<number>(100);
  const [lastWithdrawnAmount, setLastWithdrawnAmount] = useState<number>(0);

  // Depósito state
  const [depositoTab, setDepositoTab] = useState<'PROPIA' | 'TERCEROS' | 'TERCEROS_MONTO' | 'SUCCESS'>('PROPIA');
  const [montoPropia, setMontoPropia] = useState<number>(200);
  const [destCodigo, setDestCodigo] = useState<string>('1001');
  const [destUsuario, setDestUsuario] = useState<string>('daniellajeje');
  const [destClienteFound, setDestClienteFound] = useState<Cliente | null>(null);
  const [montoTerceros, setMontoTerceros] = useState<number>(150);
  const [lastDepositInfo, setLastDepositInfo] = useState<{ monto: number; dest?: string } | null>(null);

  // Registro state
  const [regTab, setRegTab] = useState<'PERSONALES' | 'CUENTA' | 'SUCCESS'>('PERSONALES');
  const [regNombre, setRegNombre] = useState('Carlos');
  const [regApellido, setRegApellido] = useState('Mendoza');
  const [regFecha, setRegFecha] = useState('15/05/1998');
  const [regDPI, setRegDPI] = useState('3025112230101');
  const [regCorreo, setRegCorreo] = useState('carlos.mendoza@banco.gt');
  const [regTelefono, setRegTelefono] = useState('45678901');
  const [regNewCodigo, setRegNewCodigo] = useState<number>(1003);
  const [regUsuario, setRegUsuario] = useState('carlosm');
  const [regContra, setRegContra] = useState('ciscO@123');
  const [regBanco, setRegBanco] = useState('Industrial');
  const [regMontoInicial, setRegMontoInicial] = useState('250');
  const [regError, setRegError] = useState<string | null>(null);

  // Audio / Visual Alert feedback
  const [receiptModal, setReceiptModal] = useState<{
    titulo: string;
    detalles: { etiqueta: string; valor: string }[];
  } | null>(null);

  const getTodayDateStr = () => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    return `${d}/${m}/${y}`;
  };

  // Calculate daily withdrawal for current user
  const getTodayWithdrawn = (codigo: number) => {
    const today = getTodayDateStr();
    return retiros
      .filter((r) => r.codigo === codigo && r.fecha === today)
      .reduce((acc, curr) => acc + curr.monto, 0);
  };

  // Calculate daily deposit to others for current user
  const getTodayDepositedToOthers = (codigo: number) => {
    const today = getTodayDateStr();
    return depositos
      .filter((d) => d.codigoDepositante === codigo && d.fecha === today)
      .reduce((acc, curr) => acc + curr.monto, 0);
  };

  // Quick Preset Loader
  const loadPresetUser = (client: Cliente) => {
    setLoginCodigo(String(client.codigo));
    setLoginUsuario(client.usuario);
    setLoginContra(client.contraseña);
    setLoginAlert(null);
  };

  // LOGIN LOGIC (Exact C# Form1.cs logic)
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginAlert(null);

    const codNum = parseInt(loginCodigo, 10);
    const clienteFound = clientes.find((c) => c.codigo === codNum);

    if (!clienteFound) {
      setLoginAlert({ type: 'error', message: 'Código Incorrecto. No se encontró el cliente.' });
      return;
    }

    // Reset attempt counter if code changed
    let currentAttempts = intentosRestantes;
    if (lastAttemptCodigo !== loginCodigo) {
      currentAttempts = 3;
      setIntentosRestantes(3);
    }
    setLastAttemptCodigo(loginCodigo);

    if (clienteFound.usuario !== loginUsuario) {
      setLoginAlert({ type: 'error', message: 'Usuario Incorrecto.' });
      return;
    }

    if (clienteFound.contraseña !== loginContra) {
      const remaining = currentAttempts - 1;
      setIntentosRestantes(remaining);

      if (remaining <= 0) {
        // Bloquear cuenta (exact C# line 87)
        setClientes((prev) =>
          prev.map((c) => (c.codigo === codNum ? { ...c, estado: false } : c))
        );
        setLoginAlert({
          type: 'error',
          message: 'Contraseña Incorrecta. Su cuenta ha sido bloqueada por superar los 3 intentos.',
        });
      } else {
        setLoginAlert({
          type: 'warning',
          message: `Contraseña Incorrecta. Intentos restantes: ${remaining}.`,
        });
      }
      return;
    }

    // Check account status
    if (!clienteFound.estado) {
      setLoginAlert({
        type: 'error',
        message: 'Su cuenta está bloqueada. Por favor contacte al administrador.',
      });
      return;
    }

    // Success! Enter main menu
    setCurrentUser(clienteFound);
    setCurrentScreen('MENU');
    setIntentosRestantes(3);
    setLoginAlert(null);
  };

  // RETIRO LOGIC (Exact C# Retiro.cs logic)
  const executeRetiro = (monto: number) => {
    if (!currentUser) return;
    const today = getTodayDateStr();
    const clienteActual = clientes.find((c) => c.codigo === currentUser.codigo);
    if (!clienteActual) return;

    if (monto <= 0) {
      alert(`No es posible retirar Q${monto}`);
      return;
    }

    if (clienteActual.monto < monto) {
      alert('Error: Su saldo es insuficiente para realizar esta transacción');
      return;
    }

    const withdrawnToday = getTodayWithdrawn(clienteActual.codigo);
    const maxDaily = 3000;
    const availableToWithdrawToday = maxDaily - withdrawnToday;

    if (withdrawnToday >= maxDaily) {
      alert('Solo puede retirar Q3,000.00 al día. Ya ha retirado la cantidad máxima.');
      return;
    }

    if (monto > availableToWithdrawToday) {
      alert(
        `Solo puede retirar Q3,000.00 al día. Ya ha retirado: Q${withdrawnToday}.00. Puede retirar hasta: Q${availableToWithdrawToday}.00`
      );
      return;
    }

    // Deduct and save
    const newBalance = clienteActual.monto - monto;
    setClientes((prev) =>
      prev.map((c) => (c.codigo === clienteActual.codigo ? { ...c, monto: newBalance } : c))
    );
    setCurrentUser({ ...clienteActual, monto: newBalance });

    // Append to CSV
    const nuevoRegistro: RetiroRegistro = {
      codigo: clienteActual.codigo,
      nombre: clienteActual.nombre,
      apellido: clienteActual.apellido,
      monto,
      fecha: today,
    };
    setRetiros((prev) => [...prev, nuevoRegistro]);
    setLastWithdrawnAmount(monto);

    // Show receipt
    setReceiptModal({
      titulo: 'COMPROBANTE DE RETIRO DE EFECTIVO',
      detalles: [
        { etiqueta: 'Fecha / Hora', valor: `${today} ${new Date().toLocaleTimeString()}` },
        { etiqueta: 'Cliente', valor: `${clienteActual.nombre} ${clienteActual.apellido}` },
        { etiqueta: 'No. Cuenta / Código', valor: String(clienteActual.codigo) },
        { etiqueta: 'Banco Emisor', valor: clienteActual.banco },
        { etiqueta: 'Monto Retirado', valor: `Q ${monto.toFixed(2)}` },
        { etiqueta: 'Nuevo Saldo Disponible', valor: `Q ${newBalance.toFixed(2)}` },
        { etiqueta: 'Acumulado Retirado Hoy', valor: `Q ${(withdrawnToday + monto).toFixed(2)} / Q3,000.00` },
      ],
    });

    setRetiroTab('SUCCESS');
  };

  // DEPOSITO LOGIC (Exact C# Deposito.cs logic)
  const executeDepositoPropia = () => {
    if (!currentUser) return;
    const clienteActual = clientes.find((c) => c.codigo === currentUser.codigo);
    if (!clienteActual) return;

    if (montoPropia > 100000) {
      alert('El monto máximo a depositar es Q100,000.00');
      return;
    }
    if (montoPropia <= 0) {
      alert('No es posible depositar Q0.00');
      return;
    }

    const newBalance = clienteActual.monto + montoPropia;
    setClientes((prev) =>
      prev.map((c) => (c.codigo === clienteActual.codigo ? { ...c, monto: newBalance } : c))
    );
    setCurrentUser({ ...clienteActual, monto: newBalance });
    setLastDepositInfo({ monto: montoPropia });

    setReceiptModal({
      titulo: 'COMPROBANTE DE DEPÓSITO A CUENTA PROPIA',
      detalles: [
        { etiqueta: 'Fecha / Hora', valor: `${getTodayDateStr()} ${new Date().toLocaleTimeString()}` },
        { etiqueta: 'Titular', valor: `${clienteActual.nombre} ${clienteActual.apellido}` },
        { etiqueta: 'Código', valor: String(clienteActual.codigo) },
        { etiqueta: 'Monto Depositado', valor: `Q ${montoPropia.toFixed(2)}` },
        { etiqueta: 'Nuevo Saldo', valor: `Q ${newBalance.toFixed(2)}` },
      ],
    });

    setDepositoTab('SUCCESS');
  };

  const handleValidarCuentaTerceros = () => {
    const cod = parseInt(destCodigo, 10);
    const dest = clientes.find((c) => c.codigo === cod);

    if (!dest) {
      alert('La cuenta que busca no existe');
      return;
    }

    if (dest.usuario !== destUsuario) {
      alert('El usuario no coincide con el código ingresado');
      return;
    }

    if (!dest.estado) {
      alert(`La cuenta a nombre de ${dest.nombre} ${dest.apellido} está bloqueada.`);
      return;
    }

    alert(`Se encontró la cuenta a nombre de ${dest.nombre} ${dest.apellido}.`);
    setDestClienteFound(dest);
    setDepositoTab('TERCEROS_MONTO');
  };

  const executeDepositoTerceros = () => {
    if (!currentUser || !destClienteFound) return;
    const emisor = clientes.find((c) => c.codigo === currentUser.codigo);
    const receptor = clientes.find((c) => c.codigo === destClienteFound.codigo);
    if (!emisor || !receptor) return;

    if (montoTerceros <= 0) {
      alert(`No es posible depositar Q${montoTerceros}`);
      return;
    }

    if (emisor.monto < montoTerceros) {
      alert('Error, su saldo es insuficiente para realizar esta transacción');
      return;
    }

    const today = getTodayDateStr();
    const depositedToday = getTodayDepositedToOthers(emisor.codigo);
    const maxDaily = 2000;
    const availableToDeposit = maxDaily - depositedToday;

    if (depositedToday >= maxDaily) {
      alert('Solo puede depositar Q2,000.00 al día. Ya ha depositado la cantidad máxima.');
      return;
    }

    if (montoTerceros > availableToDeposit) {
      alert(
        `Solo puede depositar Q2,000.00 al día. Ya ha depositado: Q${depositedToday}.00. Puede depositar hasta: Q${availableToDeposit}.00`
      );
      return;
    }

    // Perform transaction
    const newEmisorBalance = emisor.monto - montoTerceros;
    const newReceptorBalance = receptor.monto + montoTerceros;

    setClientes((prev) =>
      prev.map((c) => {
        if (c.codigo === emisor.codigo) return { ...c, monto: newEmisorBalance };
        if (c.codigo === receptor.codigo) return { ...c, monto: newReceptorBalance };
        return c;
      })
    );

    setCurrentUser({ ...emisor, monto: newEmisorBalance });

    // Append to CSV
    const nuevoReg: DepositoRegistro = {
      codigoDepositante: emisor.codigo,
      usuarioDepositante: emisor.usuario,
      codigoReceptor: receptor.codigo,
      usuarioReceptor: receptor.usuario,
      monto: montoTerceros,
      fecha: today,
    };
    setDepositos((prev) => [...prev, nuevoReg]);

    setReceiptModal({
      titulo: 'COMPROBANTE DE TRANSFERENCIA / DEPÓSITO A TERCERO',
      detalles: [
        { etiqueta: 'Fecha / Hora', valor: `${today} ${new Date().toLocaleTimeString()}` },
        { etiqueta: 'Cuenta Emisora', valor: `${emisor.codigo} (${emisor.usuario})` },
        { etiqueta: 'Cuenta Receptora', valor: `${receptor.codigo} (${receptor.nombre} ${receptor.apellido})` },
        { etiqueta: 'Monto Transferido', valor: `Q ${montoTerceros.toFixed(2)}` },
        { etiqueta: 'Saldo Restante Emisor', valor: `Q ${newEmisorBalance.toFixed(2)}` },
        { etiqueta: 'Acumulado Hoy a Terceros', valor: `Q ${(depositedToday + montoTerceros).toFixed(2)} / Q2,000.00` },
      ],
    });

    setLastDepositInfo({ monto: montoTerceros, dest: `${receptor.nombre} (${receptor.codigo})` });
    setDepositoTab('SUCCESS');
  };

  // REGISTRO LOGIC (Exact C# RegistroCuenta.cs Regexes)
  const regexNombreApellido = /^[a-zA-Z]+$/;
  const regexFechaNac = /^((([0-2][1-9]|[1-2][0-9])\/02)|([0-2][1-9]|[1-2][0-9]|3[0-1])\/(01|03|05|07|08|10|12)|([0-2][1-9]|[1-2][0-9]|30)\/(04|06|09|11))\/(19[0-9][0-9]|200[0-5])$/;
  const regexTelefono = /^[0-9]{8}$/;
  const regexDPI = /^([0-9]{10}|[0-9]{11}|[0-9]{12}|[0-9]{13}|[0-9]{14}|[0-9]{15})$/;
  const regexCorreo = /^[a-zA-Z0-9._\-()?]+@[a-z\-0-9.]+\.[a-z]{3}$/;

  const regexUsuario = /^\w+$/;
  const regexContraLen = /^.{6,}$/;
  const regexContraHasUpper = /[A-Z]/;
  const regexContraStartsWithUpper = /^[A-Z]/;
  const regexContraHasNum = /[0-9]/;
  const regexContraSpecial = /(@+|_|-|\*|\.+|#+|\$+|\++|=+|\?+|!+|%+)/;

  const handleValidarPersonales = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regNombre.trim() || !regApellido.trim()) {
      setRegError('El campo de nombre o apellido está vacío.');
      return;
    }

    if (!regexNombreApellido.test(regNombre) || !regexNombreApellido.test(regApellido)) {
      setRegError('El nombre y apellido únicamente pueden contener letras.');
      return;
    }

    if (!regexFechaNac.test(regFecha)) {
      setRegError('La fecha de nacimiento ingresada no es válida (Formato: DD/MM/AAAA, año entre 1900 y 2005).');
      return;
    }

    if (!regexTelefono.test(regTelefono)) {
      setRegError('El Teléfono ingresado no es válido (Debe contener exactamente 8 dígitos).');
      return;
    }

    if (clientes.some((c) => c.telefono === parseInt(regTelefono, 10))) {
      setRegError('El teléfono que ingresó ya existe en otra cuenta.');
      return;
    }

    if (!regexDPI.test(regDPI)) {
      setRegError('El DPI ingresado no es válido (Debe contener entre 10 y 15 dígitos numéricos).');
      return;
    }

    if (clientes.some((c) => c.DPI === parseInt(regDPI, 10))) {
      setRegError('El DPI que ingresó ya existe en otra cuenta.');
      return;
    }

    if (regCorreo.trim() && !regexCorreo.test(regCorreo)) {
      setRegError('El correo ingresado no es válido.');
      return;
    }

    if (regCorreo.trim() && clientes.some((c) => c.correo.toLowerCase() === regCorreo.trim().toLowerCase())) {
      setRegError('El correo electrónico que ingresó ya existe en otra cuenta.');
      return;
    }

    // Step 1 passed! Next code
    const maxCode = clientes.reduce((max, c) => Math.max(max, c.codigo), 999);
    setRegNewCodigo(maxCode + 1);
    setRegTab('CUENTA');
  };

  const handleCrearCuenta = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regexUsuario.test(regUsuario)) {
      setRegError('El usuario debe contener al menos letras o números válidos.');
      return;
    }

    if (clientes.some((c) => c.usuario.toLowerCase() === regUsuario.trim().toLowerCase())) {
      setRegError('El nombre de usuario ya está en uso. Por favor elija otro.');
      return;
    }

    if (!regexContraLen.test(regContra)) {
      setRegError('La contraseña debe de ser mayor o igual a 6 caracteres.');
      return;
    }

    if (!regexContraHasUpper.test(regContra)) {
      setRegError('La contraseña debe de contener al menos una mayúscula.');
      return;
    }

    if (regexContraStartsWithUpper.test(regContra)) {
      setRegError('Regla de seguridad: La contraseña NO debe comenzar con mayúscula.');
      return;
    }

    if (!regexContraHasNum.test(regContra)) {
      setRegError('La contraseña debe contener al menos un número.');
      return;
    }

    if (!regexContraSpecial.test(regContra)) {
      setRegError('La contraseña debe contener al menos un caracter especial (@, _, -, *, ., #, $, +, =, ?, !, %).');
      return;
    }

    if (regContra.toLowerCase().includes(regUsuario.toLowerCase())) {
      setRegError('La contraseña no debe contener su nombre de usuario.');
      return;
    }

    const montoInit = parseInt(regMontoInicial, 10);
    if (isNaN(montoInit) || montoInit < 100) {
      setRegError('El mínimo del monto inicial de apertura es Q100.00.');
      return;
    }

    if (!regBanco) {
      setRegError('No seleccionó ningún banco.');
      return;
    }

    // Create client
    const nuevoCliente: Cliente = {
      codigo: regNewCodigo,
      nombre: regNombre,
      apellido: regApellido,
      fecha_de_nacimiento: regFecha,
      DPI: parseInt(regDPI, 10),
      correo: regCorreo || ' ',
      telefono: parseInt(regTelefono, 10),
      usuario: regUsuario,
      contraseña: regContra,
      banco: regBanco,
      monto: montoInit,
      estado: true,
    };

    setClientes((prev) => [...prev, nuevoCliente]);
    setRegTab('SUCCESS');
    setLoginCodigo(String(regNewCodigo));
    setLoginUsuario(regUsuario);
    setLoginContra(regContra);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* LEFT: Physical ATM Bezel / WinForms Frame */}
      <div className="w-full lg:w-[680px] bg-slate-900 border-4 border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-indigo-950/40 relative">
        {/* ATM Top Header Bezel */}
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-900 shadow-md">
              <DollarSign className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200 tracking-wider flex items-center gap-2">
                BANCO DEL PROYECTO
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
              <div className="text-[11px] text-slate-400">ATM C# Windows Forms Simulator</div>
            </div>
          </div>

          {/* Quick status badge */}
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Moneda</div>
            <div className="text-xs font-bold text-amber-400">GTQ (Quetzales)</div>
          </div>
        </div>

        {/* The ATM Screen (Blue & Gold Theme matching C# project) */}
        <div className="bg-[#242b78] border-2 border-[#f2c641]/60 rounded-2xl overflow-hidden shadow-inner flex flex-col min-h-[540px] relative text-white">
          {/* WinForms Titlebar */}
          <div className="bg-[#181c52] px-4 py-2 flex items-center justify-between border-b border-white/10 select-none">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-xs font-bold tracking-wide text-amber-200">
                {currentScreen === 'LOGIN' && 'Cajero - Form1 (Login de Usuario)'}
                {currentScreen === 'MENU' && 'Cajero - Menu_Inicio'}
                {currentScreen === 'RETIRO' && 'Cajero - Retiro de Efectivo'}
                {currentScreen === 'DEPOSITO' && 'Cajero - Depósito'}
                {currentScreen === 'CONSULTA' && 'Cajero - Consulta de Saldo'}
                {currentScreen === 'REGISTRO' && 'Cajero - Registro de Nueva Cuenta'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="hover:text-white cursor-pointer px-1">_</span>
              <span className="hover:text-white cursor-pointer px-1">□</span>
              <span className="hover:text-red-400 cursor-pointer px-1">✕</span>
            </div>
          </div>

          {/* SCREEN CONTENT */}
          <div className="p-4 sm:p-6 flex-1 flex flex-col">
            {/* ================= SCREEN 1: LOGIN ================= */}
            {currentScreen === 'LOGIN' && (
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-[#f2c641] tracking-tight uppercase">
                      Bienvenido al Cajero
                    </h2>
                    <p className="text-xs text-blue-200 mt-1">
                      Ingrese sus credenciales de cliente para acceder a sus fondos
                    </p>
                  </div>

                  {loginAlert && (
                    <div
                      className={`mb-4 p-3 rounded-xl border flex items-center gap-3 text-xs ${
                        loginAlert.type === 'error'
                          ? 'bg-rose-950/70 border-rose-500 text-rose-200'
                          : loginAlert.type === 'warning'
                          ? 'bg-amber-950/70 border-amber-500 text-amber-200'
                          : 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <div>{loginAlert.message}</div>
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-3.5 max-w-md mx-auto">
                    <div>
                      <label className="block text-xs font-bold text-[#f2c641] mb-1">
                        Código de Cliente:
                      </label>
                      <input
                        type="number"
                        value={loginCodigo}
                        onChange={(e) => setLoginCodigo(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900/90 border border-blue-300/40 rounded-lg text-white font-mono text-sm focus:border-amber-400 focus:outline-none"
                        placeholder="Ej. 1000"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#f2c641] mb-1">
                        Nombre de Usuario:
                      </label>
                      <input
                        type="text"
                        value={loginUsuario}
                        onChange={(e) => setLoginUsuario(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900/90 border border-blue-300/40 rounded-lg text-white text-sm focus:border-amber-400 focus:outline-none"
                        placeholder="Ej. eduardofujeje"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#f2c641] mb-1">
                        Contraseña:
                      </label>
                      <input
                        type="password"
                        value={loginContra}
                        onChange={(e) => setLoginContra(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900/90 border border-blue-300/40 rounded-lg text-white text-sm focus:border-amber-400 focus:outline-none"
                        placeholder="••••••••"
                        required
                      />
                      <div className="flex justify-between items-center mt-1 text-[11px] text-blue-200">
                        <span>Intentos restantes: <strong className="text-amber-400">{intentosRestantes}</strong></span>
                        <span className="text-[10px] text-slate-400">(Bloquea a 0)</span>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 px-4 bg-[#f2c641] hover:bg-amber-300 text-slate-950 font-black rounded-lg text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Unlock className="w-4 h-4" /> Ingresar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRegTab('PERSONALES');
                          setCurrentScreen('REGISTRO');
                        }}
                        className="py-2.5 px-4 bg-blue-900/80 hover:bg-blue-800 text-amber-200 font-bold rounded-lg text-xs transition-all border border-blue-400/40 cursor-pointer flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Registrarse
                      </button>
                    </div>
                  </form>
                </div>

                {/* Preset Fast Picker for Testing */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="text-[11px] font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Cuentas de Prueba Pre-cargadas en SQL:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {clientes.slice(0, 3).map((cl) => (
                      <button
                        key={cl.codigo}
                        type="button"
                        onClick={() => loadPresetUser(cl)}
                        className={`text-left p-2 rounded-lg border text-[11px] transition-all cursor-pointer ${
                          loginCodigo === String(cl.codigo)
                            ? 'bg-amber-400/20 border-amber-400 text-white'
                            : 'bg-slate-900/40 border-white/10 hover:border-white/30 text-slate-300'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{cl.nombre} {cl.apellido}</span>
                          {cl.estado ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          )}
                        </div>
                        <div className="text-[10px] text-amber-300/90 font-mono">
                          Cod: {cl.codigo} | Q{cl.monto}
                        </div>
                        <div className="text-[9px] text-slate-400">
                          {cl.estado ? 'Activa' : 'Bloqueada'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= SCREEN 2: MENÚ PRINCIPAL ================= */}
            {currentScreen === 'MENU' && currentUser && (
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  {/* Customer Banner */}
                  <div className="bg-[#191d57] p-4 rounded-xl border border-blue-400/30 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-md">
                    <div>
                      <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                        Bienvenido al Cajero
                      </div>
                      <div className="text-xl font-black text-white flex items-center gap-2">
                        {currentUser.nombre} {currentUser.apellido}
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/40">
                          {currentUser.banco}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-0.5">
                        Código de cuenta: <span className="text-amber-400 font-bold">{currentUser.codigo}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase text-slate-400">Saldo Disponible</div>
                      <div className="text-2xl font-black text-[#f2c641]">
                        Q {currentUser.monto.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Menu Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto">
                    {/* 1. Retiro */}
                    <button
                      type="button"
                      onClick={() => {
                        setRetiroTab('PRESETS');
                        setCurrentScreen('RETIRO');
                      }}
                      className="p-4 bg-gradient-to-br from-blue-700/80 to-blue-900/90 hover:from-blue-600 hover:to-blue-800 border-2 border-amber-400/60 hover:border-amber-400 rounded-xl text-left transition-all group shadow-md cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-black text-amber-300 text-base flex items-center gap-2">
                          <span>1. Retiro de Efectivo</span>
                        </div>
                        <div className="text-xs text-blue-100 mt-1">
                          Billetes y retiro en múltiplos de Q50
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* 2. Depósito */}
                    <button
                      type="button"
                      onClick={() => {
                        setDepositoTab('PROPIA');
                        setCurrentScreen('DEPOSITO');
                      }}
                      className="p-4 bg-gradient-to-br from-blue-700/80 to-blue-900/90 hover:from-blue-600 hover:to-blue-800 border-2 border-amber-400/60 hover:border-amber-400 rounded-xl text-left transition-all group shadow-md cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-black text-amber-300 text-base flex items-center gap-2">
                          <span>2. Depósito</span>
                        </div>
                        <div className="text-xs text-blue-100 mt-1">
                          A tu cuenta o transferencia a terceros
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* 3. Consulta */}
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('CONSULTA')}
                      className="p-4 bg-gradient-to-br from-blue-700/80 to-blue-900/90 hover:from-blue-600 hover:to-blue-800 border-2 border-amber-400/60 hover:border-amber-400 rounded-xl text-left transition-all group shadow-md cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-black text-amber-300 text-base flex items-center gap-2">
                          <span>3. Consulta de Saldo</span>
                        </div>
                        <div className="text-xs text-blue-100 mt-1">
                          Detalle en pantalla y registros SQL
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* 4. Cerrar Sesión */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentUser(null);
                        setCurrentScreen('LOGIN');
                      }}
                      className="p-4 bg-rose-950/70 hover:bg-rose-900/80 border-2 border-rose-500/60 hover:border-rose-400 rounded-xl text-left transition-all group shadow-md cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-black text-rose-300 text-base flex items-center gap-2">
                          <span>4. Cerrar Sesión</span>
                        </div>
                        <div className="text-xs text-rose-200 mt-1">
                          Expulsar tarjeta y volver al login
                        </div>
                      </div>
                      <LogOut className="w-5 h-5 text-rose-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Bottom Daily Limits Summary */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap justify-between items-center text-xs text-blue-200">
                  <div>
                    Retirado hoy: <strong className="text-amber-400">Q{getTodayWithdrawn(currentUser.codigo)}.00</strong> / Q3,000.00
                  </div>
                  <div>
                    Transferido a terceros hoy: <strong className="text-amber-400">Q{getTodayDepositedToOthers(currentUser.codigo)}.00</strong> / Q2,000.00
                  </div>
                </div>
              </div>
            )}

            {/* ================= SCREEN 3: RETIRO ================= */}
            {currentScreen === 'RETIRO' && currentUser && (
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                    <div>
                      <h3 className="text-lg font-black text-[#f2c641]">Retiro de Efectivo</h3>
                      <div className="text-xs text-blue-200">
                        Saldo actual: <strong>Q{currentUser.monto.toFixed(2)}</strong> &bull; Límite diario: Q3,000.00
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('MENU')}
                      className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer"
                    >
                      Volver al Menú
                    </button>
                  </div>

                  {retiroTab === 'PRESETS' && (
                    <div>
                      <p className="text-xs text-slate-300 mb-3 text-center">
                        Seleccione una denominación predefinida o ingrese otra cantidad:
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        {[50, 100, 200, 400, 600, 1000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => executeRetiro(amt)}
                            className="py-3 px-4 bg-[#3b43b6] hover:bg-[#4f58de] border-2 border-[#f2c641]/70 hover:border-[#f2c641] rounded-xl font-black text-amber-300 text-base shadow-md active:scale-95 transition-all cursor-pointer flex flex-col items-center"
                          >
                            <span>Q{amt}.00</span>
                            <span className="text-[10px] text-blue-200 font-normal">Retiro Rápido</span>
                          </button>
                        ))}
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setRetiroTab('CUSTOM')}
                          className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 border border-amber-400/50 text-amber-300 font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
                        >
                          <DollarSign className="w-4 h-4" /> Retirar otra cantidad personalizada
                        </button>
                      </div>
                    </div>
                  )}

                  {retiroTab === 'CUSTOM' && (
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="bg-slate-900/60 p-4 rounded-xl border border-white/10 text-center">
                        <label className="block text-xs font-bold text-[#f2c641] mb-2">
                          Monto a retirar (Únicamente múltiplos de Q50):
                        </label>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xl font-bold text-amber-400">Q</span>
                          <input
                            type="number"
                            step="50"
                            min="50"
                            value={customRetiroMonto}
                            onChange={(e) => setCustomRetiroMonto(parseInt(e.target.value, 10) || 0)}
                            className="w-40 px-3 py-2 bg-slate-950 border border-blue-300/40 rounded-lg text-white font-mono text-center text-lg font-bold focus:border-amber-400 focus:outline-none"
                          />
                          <span className="text-sm font-bold text-slate-400">.00</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-2">
                          Monto restante disponible hoy: Q{3000 - getTodayWithdrawn(currentUser.codigo)}.00
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (customRetiroMonto % 50 !== 0) {
                              alert('Error, Sólo puede retirar en múltiplos de 50');
                              return;
                            }
                            executeRetiro(customRetiroMonto);
                          }}
                          className="flex-1 py-2.5 bg-[#f2c641] hover:bg-amber-300 text-slate-950 font-black rounded-lg text-sm transition-all shadow-md cursor-pointer"
                        >
                          Confirmar Retiro
                        </button>
                        <button
                          type="button"
                          onClick={() => setRetiroTab('PRESETS')}
                          className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {retiroTab === 'SUCCESS' && (
                    <div className="text-center py-6">
                      <div className="w-14 h-14 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-3 animate-bounce">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-black text-amber-300">¡Transacción Realizada!</h4>
                      <p className="text-xs text-blue-100 mt-1">
                        Se han retirado con éxito: <strong className="text-amber-400">Q{lastWithdrawnAmount}.00</strong>
                      </p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Por favor tome su dinero del dispensador y su comprobante.
                      </p>

                      <div className="mt-6 flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setRetiroTab('PRESETS')}
                          className="py-2 px-4 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-lg cursor-pointer"
                        >
                          Realizar otro retiro
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentScreen('MENU')}
                          className="py-2 px-4 bg-[#f2c641] hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg cursor-pointer"
                        >
                          Volver al Menú
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 text-center pt-3 border-t border-white/10">
                  📁 Cada transacción se registra automáticamente en <code className="text-amber-300">Transacciones/Retiros.csv</code>
                </div>
              </div>
            )}

            {/* ================= SCREEN 4: DEPÓSITO ================= */}
            {currentScreen === 'DEPOSITO' && currentUser && (
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                    <div>
                      <h3 className="text-lg font-black text-[#f2c641]">Depósitos</h3>
                      <div className="text-xs text-blue-200">
                        Saldo actual: <strong>Q{currentUser.monto.toFixed(2)}</strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('MENU')}
                      className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer"
                    >
                      Volver al Menú
                    </button>
                  </div>

                  {/* Mode switcher */}
                  {depositoTab !== 'SUCCESS' && (
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setDepositoTab('PROPIA')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          depositoTab === 'PROPIA'
                            ? 'bg-[#f2c641] text-slate-950 border-amber-400 shadow-md'
                            : 'bg-slate-900/40 text-blue-200 border-white/10 hover:border-white/30'
                        }`}
                      >
                        Depositar a tu cuenta
                      </button>
                      <button
                        type="button"
                        onClick={() => setDepositoTab('TERCEROS')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          depositoTab === 'TERCEROS' || depositoTab === 'TERCEROS_MONTO'
                            ? 'bg-[#f2c641] text-slate-950 border-amber-400 shadow-md'
                            : 'bg-slate-900/40 text-blue-200 border-white/10 hover:border-white/30'
                        }`}
                      >
                        Depositar a otras cuentas
                      </button>
                    </div>
                  )}

                  {/* Tab 1: Propia */}
                  {depositoTab === 'PROPIA' && (
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="bg-slate-900/60 p-4 rounded-xl border border-white/10">
                        <label className="block text-xs font-bold text-[#f2c641] mb-2 text-center">
                          Ingrese la cantidad a depositar a su cuenta:
                        </label>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xl font-bold text-amber-400">Q</span>
                          <input
                            type="number"
                            min="1"
                            max="100000"
                            value={montoPropia}
                            onChange={(e) => setMontoPropia(parseInt(e.target.value, 10) || 0)}
                            className="w-44 px-3 py-2 bg-slate-950 border border-blue-300/40 rounded-lg text-white font-mono text-center text-lg font-bold focus:border-amber-400 focus:outline-none"
                          />
                          <span className="text-sm font-bold text-slate-400">.00</span>
                        </div>
                        <div className="text-[11px] text-slate-400 text-center mt-2">
                          Monto máximo permitido: Q100,000.00
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={executeDepositoPropia}
                        className="w-full py-2.5 bg-[#f2c641] hover:bg-amber-300 text-slate-950 font-black rounded-lg text-sm transition-all shadow-md cursor-pointer"
                      >
                        Realizar Depósito
                      </button>
                    </div>
                  )}

                  {/* Tab 2: Terceros - Step 1 Verification */}
                  {depositoTab === 'TERCEROS' && (
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="bg-slate-900/60 p-4 rounded-xl border border-white/10 space-y-3">
                        <div className="text-xs font-bold text-[#f2c641] text-center mb-1">
                          Validar Cuenta de Destino
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">
                            Código de Cuenta Destino:
                          </label>
                          <input
                            type="number"
                            value={destCodigo}
                            onChange={(e) => setDestCodigo(e.target.value)}
                            placeholder="Ej. 1001"
                            className="w-full px-3 py-1.5 bg-slate-950 border border-blue-300/40 rounded text-sm text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">
                            Nombre de Usuario Destino:
                          </label>
                          <input
                            type="text"
                            value={destUsuario}
                            onChange={(e) => setDestUsuario(e.target.value)}
                            placeholder="Ej. daniellajeje"
                            className="w-full px-3 py-1.5 bg-slate-950 border border-blue-300/40 rounded text-sm text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleValidarCuentaTerceros}
                        className="w-full py-2.5 bg-[#f2c641] hover:bg-amber-300 text-slate-950 font-black rounded-lg text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        Validar Cuenta y Continuar <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Tab 2: Terceros - Step 2 Amount */}
                  {depositoTab === 'TERCEROS_MONTO' && destClienteFound && (
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl text-xs text-emerald-200">
                        <div className="font-bold">✓ Cuenta Verificada:</div>
                        <div>Titular: {destClienteFound.nombre} {destClienteFound.apellido}</div>
                        <div>Código: {destClienteFound.codigo} &bull; Banco: {destClienteFound.banco}</div>
                      </div>

                      <div className="bg-slate-900/60 p-4 rounded-xl border border-white/10 text-center">
                        <label className="block text-xs font-bold text-[#f2c641] mb-2">
                          Monto a Transferir (Límite diario Q2,000.00):
                        </label>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xl font-bold text-amber-400">Q</span>
                          <input
                            type="number"
                            min="1"
                            max="2000"
                            value={montoTerceros}
                            onChange={(e) => setMontoTerceros(parseInt(e.target.value, 10) || 0)}
                            className="w-44 px-3 py-2 bg-slate-950 border border-blue-300/40 rounded-lg text-white font-mono text-center text-lg font-bold focus:border-amber-400 focus:outline-none"
                          />
                          <span className="text-sm font-bold text-slate-400">.00</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-2">
                          Disponible hoy para terceros: Q{2000 - getTodayDepositedToOthers(currentUser.codigo)}.00
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={executeDepositoTerceros}
                          className="flex-1 py-2.5 bg-[#f2c641] hover:bg-amber-300 text-slate-950 font-black rounded-lg text-sm shadow-md cursor-pointer"
                        >
                          Confirmar Depósito a Tercero
                        </button>
                        <button
                          type="button"
                          onClick={() => setDepositoTab('TERCEROS')}
                          className="py-2.5 px-3 bg-slate-800 text-slate-300 text-xs rounded-lg cursor-pointer"
                        >
                          Atrás
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Success view */}
                  {depositoTab === 'SUCCESS' && (
                    <div className="text-center py-6">
                      <div className="w-14 h-14 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-3">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-black text-amber-300">¡Transacción Realizada!</h4>
                      <p className="text-xs text-blue-100 mt-1">
                        Se han depositado con éxito: <strong className="text-amber-400">Q{lastDepositInfo?.monto}.00</strong>
                        {lastDepositInfo?.dest && ` a la cuenta de ${lastDepositInfo.dest}`}
                      </p>

                      <div className="mt-6 flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setDepositoTab('PROPIA')}
                          className="py-2 px-4 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-lg cursor-pointer"
                        >
                          Otro Depósito
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentScreen('MENU')}
                          className="py-2 px-4 bg-[#f2c641] hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg cursor-pointer"
                        >
                          Volver al Menú
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 text-center pt-3 border-t border-white/10">
                  📁 Cada transacción se registra automáticamente en <code className="text-amber-300">Transacciones/Depositos.csv</code>
                </div>
              </div>
            )}

            {/* ================= SCREEN 5: CONSULTA ================= */}
            {currentScreen === 'CONSULTA' && currentUser && (
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                    <div>
                      <h3 className="text-lg font-black text-[#f2c641]">Consulta de Saldo</h3>
                      <div className="text-xs text-blue-200">
                        Usuario: <strong>{currentUser.usuario}</strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('MENU')}
                      className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer"
                    >
                      Volver al Menú
                    </button>
                  </div>

                  {/* Big Balance Display (Form Consulta C# line 49) */}
                  <div className="bg-gradient-to-r from-blue-900/90 to-indigo-950/90 p-5 rounded-2xl border-2 border-amber-400/50 text-center mb-6 shadow-lg">
                    <div className="text-xs font-semibold text-blue-200 tracking-wider uppercase">
                      Saldo Actual en Cuenta
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-[#f2c641] mt-1 font-mono">
                      Q {currentUser.monto}.00
                    </div>
                    <div className="text-xs text-emerald-300 font-medium mt-1">
                      Cuenta Estado: {currentUser.estado ? 'Activa / Operativa' : 'Bloqueada'}
                    </div>
                  </div>

                  {/* Windows Forms DataGridView Lookalike (Consulta C# line 55) */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-amber-300 flex items-center justify-between">
                      <span>dataGridView1 (Datos del Registro en SQL):</span>
                      <span className="text-[10px] text-slate-400 font-mono">SELECT * FROM clientes WHERE codigo={currentUser.codigo}</span>
                    </div>

                    <div className="overflow-x-auto border border-blue-400/30 rounded-lg bg-slate-950/80">
                      <table className="w-full text-left text-[11px] text-slate-300">
                        <thead className="bg-blue-950 text-amber-300 uppercase text-[9px] border-b border-blue-400/20">
                          <tr>
                            <th className="p-2 font-mono">codigo</th>
                            <th className="p-2">nombre</th>
                            <th className="p-2">apellido</th>
                            <th className="p-2 font-mono">DPI</th>
                            <th className="p-2">banco</th>
                            <th className="p-2 font-mono">monto</th>
                            <th className="p-2">estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                          <tr>
                            <td className="p-2 text-amber-400 font-bold">{currentUser.codigo}</td>
                            <td className="p-2">{currentUser.nombre}</td>
                            <td className="p-2">{currentUser.apellido}</td>
                            <td className="p-2">{currentUser.DPI}</td>
                            <td className="p-2 text-blue-300">{currentUser.banco}</td>
                            <td className="p-2 text-emerald-400 font-bold">Q{currentUser.monto}</td>
                            <td className="p-2">{currentUser.estado ? '1 (Activo)' : '0 (Bloqueado)'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setReceiptModal({
                        titulo: 'COMPROBANTE DE CONSULTA DE SALDO',
                        detalles: [
                          { etiqueta: 'Fecha / Hora', valor: `${getTodayDateStr()} ${new Date().toLocaleTimeString()}` },
                          { etiqueta: 'Titular', valor: `${currentUser.nombre} ${currentUser.apellido}` },
                          { etiqueta: 'Código', valor: String(currentUser.codigo) },
                          { etiqueta: 'Banco', valor: currentUser.banco },
                          { etiqueta: 'Saldo Disponible', valor: `Q ${currentUser.monto}.00` },
                        ],
                      });
                    }}
                    className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-lg border border-amber-400/40 cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Imprimir Recibo
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('MENU')}
                    className="py-2 px-4 bg-[#f2c641] hover:bg-amber-300 text-slate-950 font-black text-xs rounded-lg cursor-pointer"
                  >
                    Volver al Menú
                  </button>
                </div>
              </div>
            )}

            {/* ================= SCREEN 6: REGISTRO DE CUENTA ================= */}
            {currentScreen === 'REGISTRO' && (
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                    <div>
                      <h3 className="text-lg font-black text-[#f2c641]">Registro de Nueva Cuenta</h3>
                      <div className="text-[11px] text-blue-200">
                        {regTab === 'PERSONALES' && 'Paso 1 de 2: Datos Personales (Validaciones Regex)'}
                        {regTab === 'CUENTA' && `Paso 2 de 2: Credenciales Bancarias (Código: ${regNewCodigo})`}
                        {regTab === 'SUCCESS' && '¡Cuenta Creada Exitosamente!'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('LOGIN')}
                      className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer"
                    >
                      Volver al Login
                    </button>
                  </div>

                  {regError && (
                    <div className="mb-3 p-2.5 rounded-lg bg-rose-950/70 border border-rose-500 text-rose-200 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  {/* Step 1: Personales */}
                  {regTab === 'PERSONALES' && (
                    <form onSubmit={handleValidarPersonales} className="space-y-2.5 text-xs">
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-amber-300 mb-0.5">
                            Nombre (Solo letras):
                          </label>
                          <input
                            type="text"
                            value={regNombre}
                            onChange={(e) => setRegNombre(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-blue-300/40 rounded text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-amber-300 mb-0.5">
                            Apellido (Solo letras):
                          </label>
                          <input
                            type="text"
                            value={regApellido}
                            onChange={(e) => setRegApellido(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-blue-300/40 rounded text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-amber-300 mb-0.5">
                            Fecha Nac (DD/MM/AAAA):
                          </label>
                          <input
                            type="text"
                            value={regFecha}
                            onChange={(e) => setRegFecha(e.target.value)}
                            placeholder="15/05/1998"
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-blue-300/40 rounded text-white font-mono"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-amber-300 mb-0.5">
                            Teléfono (8 dígitos):
                          </label>
                          <input
                            type="text"
                            value={regTelefono}
                            onChange={(e) => setRegTelefono(e.target.value)}
                            maxLength={8}
                            placeholder="45678901"
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-blue-300/40 rounded text-white font-mono"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-amber-300 mb-0.5">
                            DPI (10 a 15 dígitos):
                          </label>
                          <input
                            type="text"
                            value={regDPI}
                            onChange={(e) => setRegDPI(e.target.value)}
                            placeholder="3025112230101"
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-blue-300/40 rounded text-white font-mono"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-amber-300 mb-0.5">
                            Correo Electrónico:
                          </label>
                          <input
                            type="email"
                            value={regCorreo}
                            onChange={(e) => setRegCorreo(e.target.value)}
                            placeholder="carlos@correo.com"
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-blue-300/40 rounded text-white"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-2 bg-[#f2c641] hover:bg-amber-300 text-slate-950 font-black rounded-lg text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
                        >
                          Siguiente: Credenciales y Apertura <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Step 2: Cuenta */}
                  {regTab === 'CUENTA' && (
                    <form onSubmit={handleCrearCuenta} className="space-y-2.5 text-xs">
                      <div className="p-2 bg-blue-900/40 border border-amber-400/30 rounded text-[11px] text-amber-200">
                        Código asignado por SQL Server: <strong>{regNewCodigo}</strong>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-bold text-amber-300 mb-0.5">
                            Usuario:
                          </label>
                          <input
                            type="text"
                            value={regUsuario}
                            onChange={(e) => setRegUsuario(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-blue-300/40 rounded text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-amber-300 mb-0.5">
                            Banco:
                          </label>
                          <select
                            value={regBanco}
                            onChange={(e) => setRegBanco(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-blue-300/40 rounded text-white cursor-pointer"
                          >
                            <option value="Industrial">Industrial</option>
                            <option value="Banrural">Banrural</option>
                            <option value="G&T Continental">G&T Continental</option>
                            <option value="BAC">BAC Credomatic</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-amber-300 mb-0.5">
                          Contraseña Segura (Reglas C#):
                        </label>
                        <input
                          type="text"
                          value={regContra}
                          onChange={(e) => setRegContra(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-blue-300/40 rounded text-white font-mono"
                          required
                        />
                        <div className="text-[10px] text-slate-300 mt-1 space-y-0.5 bg-slate-900/60 p-2 rounded border border-white/10">
                          <div>• Mínimo 6 caracteres</div>
                          <div>• Al menos 1 mayúscula, pero <strong>NO al inicio</strong></div>
                          <div>• Al menos 1 número y 1 caracter especial (@, _, -, #, $, etc.)</div>
                          <div>• No debe contener el nombre de usuario</div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-amber-300 mb-0.5">
                          Monto Inicial de Apertura (Mínimo Q100.00):
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-400">Q</span>
                          <input
                            type="number"
                            min="100"
                            value={regMontoInicial}
                            onChange={(e) => setRegMontoInicial(e.target.value)}
                            className="w-32 px-2.5 py-1.5 bg-slate-900 border border-blue-300/40 rounded text-white font-mono text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-[#f2c641] hover:bg-amber-300 text-slate-950 font-black rounded-lg text-xs shadow-md cursor-pointer"
                        >
                          Crear Cuenta e Insertar en SQL
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegTab('PERSONALES')}
                          className="py-2 px-3 bg-slate-800 text-slate-300 rounded-lg text-xs cursor-pointer"
                        >
                          Atrás
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Step 3: Success */}
                  {regTab === 'SUCCESS' && (
                    <div className="text-center py-6">
                      <div className="w-14 h-14 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-3">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-black text-amber-300">¡Cuenta Creada con Éxito!</h4>
                      <p className="text-xs text-blue-100 mt-1">
                        Se han guardado sus datos en la base de datos <code className="text-amber-400">registro</code>.
                      </p>
                      <div className="my-4 bg-slate-900/60 p-3 rounded-xl border border-white/10 max-w-xs mx-auto text-xs text-left">
                        <div>Código asignado: <strong className="text-amber-400 font-mono">{regNewCodigo}</strong></div>
                        <div>Usuario: <strong className="text-white">{regUsuario}</strong></div>
                        <div>Banco: <strong className="text-blue-300">{regBanco}</strong></div>
                        <div>Saldo Inicial: <strong className="text-emerald-400 font-mono">Q{regMontoInicial}.00</strong></div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentScreen('LOGIN')}
                        className="py-2.5 px-6 bg-[#f2c641] hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer"
                      >
                        Ir al Login e Iniciar Sesión
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 text-center pt-3 border-t border-white/10">
                  Valida en tiempo real con LINQ to SQL: <code>dataContext.clientes.InsertOnSubmit()</code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ATM Bottom Hardware Detail: Card Slot & Cash Dispenser */}
        <div className="mt-4 pt-4 border-t border-slate-700/80 grid grid-cols-2 gap-4">
          {/* Card Slot */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Ranura de Tarjeta</div>
              <div className="text-xs font-bold text-slate-300">
                {currentUser ? `Insertada (${currentUser.usuario})` : 'Lista para ingresar'}
              </div>
            </div>
            <CreditCard className={`w-6 h-6 ${currentUser ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          </div>

          {/* Cash Dispenser */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Dispensador de Efectivo</div>
              <div className="text-xs font-bold text-slate-300">Billetes GTQ (Q50, Q100, Q200)</div>
            </div>
            <div className="w-8 h-2 bg-slate-800 rounded-full border border-slate-600" />
          </div>
        </div>
      </div>

      {/* RIGHT: Live Receipt Printer Slip Modal / Sidebar */}
      <div className="w-full lg:flex-1 space-y-4">
        {receiptModal ? (
          <div className="bg-amber-50 border-2 border-amber-300 text-slate-900 rounded-2xl p-5 shadow-xl relative font-mono text-xs">
            {/* Serrated edge receipt top */}
            <div className="flex justify-between items-center border-b border-dashed border-slate-400 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-700" />
                <span className="font-black text-sm uppercase tracking-tight text-slate-800">
                  VOUCHER / RECIBO DE CAJERO
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReceiptModal(null)}
                className="text-slate-500 hover:text-slate-800 font-sans text-xs px-2 py-0.5 rounded hover:bg-amber-200/50 cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="text-center font-bold text-slate-800 mb-2">
              *** SISTEMA DE CAJERO AUTOMÁTICO C# ***
              <div className="text-[10px] font-normal text-slate-600">GUATEMALA, C.A. &bull; REPO EDUARDO-FU</div>
            </div>

            <div className="text-[11px] font-black text-amber-900 mb-3 text-center uppercase">
              {receiptModal.titulo}
            </div>

            <div className="space-y-1.5 border-t border-b border-dashed border-slate-400 py-3 my-2">
              {receiptModal.detalles.map((d, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-slate-600">{d.etiqueta}:</span>
                  <span className="font-bold text-slate-900">{d.valor}</span>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-center text-slate-500 mt-3">
              Transacción procesada correctamente por el sistema.
              <div>¡Gracias por usar nuestro Cajero Automático!</div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-300 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Simulador Activo de C# WinForms</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Este simulador ejecuta en tiempo real exactamente la misma lógica programada por{' '}
              <strong className="text-slate-200">Eduardo Fu</strong> en C#:
            </p>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong>Form1.cs</strong>: 3 intentos antes de bloquear la cuenta en SQL Server.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong>Retiro.cs</strong>: Múltiplos de Q50 y límite de <strong>Q3,000.00 diarios</strong> con registro en <code>Retiros.csv</code>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong>Deposito.cs</strong>: Máximo Q100,000 a cuenta propia y tope de <strong>Q2,000.00 diarios</strong> para terceros con verificación de estado.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>
                  <strong>RegistroCuenta.cs</strong>: 7 expresiones regulares (Regex) de seguridad bancaria.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Quick Database Snapshot Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-blue-400" /> Movimientos en Sesión:
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {retiros.length} Retiros &bull; {depositos.length} Depósitos
            </span>
          </div>

          <div className="text-xs space-y-1.5 max-h-48 overflow-y-auto font-mono">
            {retiros.slice(-3).map((r, i) => (
              <div key={`ret-${i}`} className="p-2 rounded bg-slate-950 border border-white/5 flex justify-between text-[11px]">
                <span className="text-rose-400 font-bold">Retiro: -Q{r.monto}.00</span>
                <span className="text-slate-400">Cod {r.codigo} ({r.nombre})</span>
              </div>
            ))}
            {depositos.slice(-3).map((d, i) => (
              <div key={`dep-${i}`} className="p-2 rounded bg-slate-950 border border-white/5 flex justify-between text-[11px]">
                <span className="text-emerald-400 font-bold">Depósito: +Q{d.monto}.00</span>
                <span className="text-slate-400">{d.usuarioDepositante} → {d.usuarioReceptor}</span>
              </div>
            ))}
            {retiros.length === 0 && depositos.length === 0 && (
              <div className="text-slate-500 text-center py-2 text-[11px]">
                Sin movimientos recientes en esta sesión.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
