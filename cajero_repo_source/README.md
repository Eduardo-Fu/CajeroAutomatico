# 🏧 Cajero Automático (ATM) en C# .NET & SQL Server

<div align="center">

[![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)](https://docs.microsoft.com/en-us/dotnet/csharp/)
[![.NET Framework](https://img.shields.io/badge/.NET_Framework-4.8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Windows Forms](https://img.shields.io/badge/UI-Windows_Forms-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://docs.microsoft.com/en-us/dotnet/desktop/winforms/)
[![SQL Server](https://img.shields.io/badge/Database-SQL_Server_Express-CC292B?style=for-the-badge&logo=microsoft-sql-server&logoColor=white)](https://www.microsoft.com/sql-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

**Aplicación de escritorio desarrollada en C# WinForms conectada a SQL Server para simulación bancaria completa, control de transacciones en quetzales (GTQ), validaciones de seguridad y auditoría en CSV.**

<br/>

[🚀 **Probar Simulador y Preview en Vivo**](https://ais-pre-yp2ksa6mdvdeieuctagcdp-651500077203.us-east1.run.app) &nbsp;&bull;&nbsp; [📖 **Documentación**](#-arquitectura-y-módulos) &nbsp;&bull;&nbsp; [🛠️ **Instalación**](#-instalación-y-configuración) &nbsp;&bull;&nbsp; [🗄️ **Base de Datos**](#-esquema-de-base-de-datos)

<br/>

<!-- PREVIEW BANNER -->
<img src="./preview-cajero.svg" alt="Preview Cajero Automático C#" width="100%" />

</div>

---

## 🌟 Características Principales

- **🔐 Autenticación y Control de Intentos**:
  - Validación con triple factor: **Código de Cliente**, **Nombre de Usuario** y **Contraseña**.
  - Contador de seguridad con **máximo 3 intentos erróneos**.
  - **Bloqueo automático de cuenta** en la base de datos al superar el límite de intentos.

- **💵 Retiro de Efectivo en Quetzales (GTQ)**:
  - Botones rápidos de retiro: `Q50.00`, `Q100.00`, `Q200.00`, `Q400.00`, `Q600.00` y `Q1000.00`.
  - Opción de **monto personalizado** (requiere estrictamente múltiplos de Q50).
  - Verificación de saldo disponible y cálculo de cambio.
  - **Límite diario acumulativo de retiros:** Máximo **Q3,000.00 por día**.

- **📥 Depósitos a Cuentas**:
  - **Depósito a cuenta propia**: límite de hasta Q100,000.00 por transacción.
  - **Depósito a cuentas de terceros**: comprobación previa de código, usuario y estado activo de la cuenta receptora.
  - **Límite diario de transferencias/depósitos a terceros:** Máximo **Q2,000.00 por día**.

- **👤 Registro de Clientes Nuevos**:
  - Registro guiado en 2 etapas: Datos Personales y Credenciales Bancarias.
  - Validaciones con expresiones regulares (`Regex`):
    - Nombre y Apellido (únicamente letras).
    - Fecha de nacimiento (validación de formatos de calendario y años 1900–2005).
    - Teléfono guatemalteco de 8 dígitos numéricos (comprobación de unicidad).
    - DPI guatemalteco de 10 a 15 dígitos (comprobación de no duplicidad).
    - Correo electrónico con estructura válida.
    - Contraseña robusta (mínimo 6 caracteres, al menos un número, caracter especial, al menos una mayúscula pero **no al inicio**, y sin incluir el usuario).
    - Depósito de apertura mínimo de **Q100.00**.

- **📊 Auditoría y Registro en CSV**:
  - `Retiros.csv`: guarda automáticamente `Codigo;Nombre;Apellido;Monto Retirado;Fecha`.
  - `Depositos.csv`: guarda `CodigoDepositante;UsuarioDepositante;CodigoReceptor;UsuarioReceptor;Monto;Fecha`.

- **🗄️ Persistencia con LINQ to SQL**:
  - Mapeo relacional con `RegistroDataContext` (`Registro.dbml`) sobre Microsoft SQL Server.

---

## 🖥️ Demostración y Preview en GitHub

Puedes probar la versión simulada interactiva directamente en la web sin compilar:

👉 **[Abrir Demo Interactivo de Cajero Automático](https://ais-pre-yp2ksa6mdvdeieuctagcdp-651500077203.us-east1.run.app)**

---

## 👥 Cuentas de Prueba Preconfiguradas

| Código | Usuario | Contraseña | DPI | Banco | Saldo Inicial | Estado |
| :---: | :--- | :--- | :---: | :--- | :---: | :---: |
| **1000** | `eduardofujeje` | `ciscO@123` | `3023043040101` | Industrial | **Q 150.00** | ✅ Activo |
| **1001** | `daniellajeje` | `ciscO@123` | `3021675360101` | Banrural | **Q 1,500.00** | ✅ Activo |
| **1002** | `laloooo1` | `andreA@145` | `3021051570101` | Industrial | **Q 10,000.00** | ❌ Bloqueado |

---

## 🛠️ Instalación y Configuración

1. **Clonar repositorio**:
   ```bash
   git clone https://github.com/Eduardo-Fu/Cajero.git
   cd Cajero
   ```
2. **Ejecutar Base de Datos**: Ejecuta `Cajero/SQLQueryProyecto.sql` en SQL Server Management Studio (SSMS).
3. **Configurar Conexión**: Actualiza `App.config` con tu servidor SQL.
4. **Abrir en Visual Studio**: Abre `Cajero/Cajero.sln` y presiona `F5`.

---

## 👨‍💻 Autor

- **Eduardo Fu** - [GitHub @Eduardo-Fu](https://github.com/Eduardo-Fu)
