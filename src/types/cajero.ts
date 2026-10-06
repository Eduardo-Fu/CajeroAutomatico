export interface Cliente {
  codigo: number;
  nombre: string;
  apellido: string;
  fecha_de_nacimiento: string;
  DPI: number;
  correo: string;
  telefono: number;
  usuario: string;
  contraseña: string;
  banco: string;
  monto: number;
  estado: boolean; // true = activo, false = bloqueado
}

export interface RetiroRegistro {
  codigo: number;
  nombre: string;
  apellido: string;
  monto: number;
  fecha: string; // DD/MM/YYYY
}

export interface DepositoRegistro {
  codigoDepositante: number;
  usuarioDepositante: string;
  codigoReceptor: number;
  usuarioReceptor: string;
  monto: number;
  fecha: string; // DD/MM/YYYY
}
