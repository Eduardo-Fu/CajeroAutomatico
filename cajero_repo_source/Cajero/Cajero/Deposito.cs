using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Cajero
{
    public partial class Deposito : Form
    {
        RegistroDataContext dataContext = new RegistroDataContext();
        String rutaIMG = Directory.GetCurrentDirectory() + @"\Imagenes";
        public Deposito()
        {
            InitializeComponent();
            tabControl1.ItemSize = new Size(0, 1);
            tabPage1.BackgroundImage = Image.FromFile(rutaIMG+@"\fondo2.png");
            tabPage2.BackgroundImage = Image.FromFile(rutaIMG+@"\fondo2.png");
            tabPage3.BackgroundImage = Image.FromFile(rutaIMG+@"\fondo2.png");
            tabPage4.BackgroundImage = Image.FromFile(rutaIMG+@"\fondo2.png");
            tabPage5.BackgroundImage = Image.FromFile(rutaIMG+@"\fondo2.png");
        }

        private void CambiarPantallas(object sender, EventArgs e)
        {
            Button aux = (Button)sender;
            switch (aux.Text)
            {
                case "Depositar a tu cuenta":
                    tabControl1.SelectTab(1);
                    break;
                case "Depositar a otras cuentas":
                    tabControl1.SelectTab(2);
                    break;
            }
        }

        private void depositarr(int monto)
        {
            try
            {
                clientes clientesLogin = dataContext.clientes.Single(x => x.codigo == Convert.ToInt32(lbl_codigoDeposito.Text));
                if (monto > 0)
                {
                    clientesLogin.monto = clientesLogin.monto + monto;
                    //tabcontrol para volver al menu o cerrar sesión
                    try
                    {
                        dataContext.SubmitChanges();
                        MessageBox.Show("Se han depositado con éxito: Q" + monto + ".00", "Transacción Realizada!");
                        tabControl1.SelectTab(4);
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("No se pudo realizar la transacción", "Error!");
                    }
                }
                else
                {
                    MessageBox.Show("No es posible depositar Q" + monto, "Error!");
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show("Error, no se encontró la cuenta");
            }
        }

        private void DepositarBoton(object sender, EventArgs e)
        {
            if(NumUp_montoLocal.Value > 100000)
            {
                MessageBox.Show("El monto máximo a depositar es Q100,000.00","Limite de monto.");
                NumUp_montoLocal.Value = 0;
            }
            else
            {
                depositarr(Convert.ToInt32(NumUp_montoLocal.Value));
            }
        }

        private void VolverAlMenu(object sender, EventArgs e)
        {
            this.Hide();
            Menu_Inicio form = new Menu_Inicio();
            AddOwnedForm(form);
            form.lbl_codigoMenu.Text = this.lbl_codigoDeposito.Text;
            form.ShowDialog();
        }

        private void CerrarSesion(object sender, EventArgs e)
        {
            this.Hide();
            Login form = new Login();
            form.ShowDialog();
        }

        private void ValidarCuentaOtros(object sender, EventArgs e)
        {
            try
            {
                clientes clientesLogin = dataContext.clientes.Single(x => x.codigo == Convert.ToInt32(txt_codigoDeposito.Text));
                if (clientesLogin.usuario == txt_usuarioDeposito.Text)
                {
                    if (clientesLogin.estado == true) 
                    {
                        MessageBox.Show("Se encontró la cuenta a nombre de " + clientesLogin.nombre + " " + clientesLogin.apellido + ".");
                        tabControl1.SelectTab(3);
                        txt_codigoDepositoOtros.Text = txt_codigoDeposito.Text;
                        txt_UsuarioOtros.Text = txt_usuarioDeposito.Text;
                    }
                    else
                    {
                        MessageBox.Show("La cuenta a nombre de " + clientesLogin.nombre + " " + clientesLogin.apellido + " está bloqueada.");
                        txt_codigoDeposito.Text = "";
                        txt_usuarioDeposito.Text = "";
                    }
                    
                }
                else
                {
                    MessageBox.Show("El usuario no coincide con el código ingresado", "Error!");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("La cuenta que busca no existe", "Error!");
            }
        }

        int monto = 0;
        int montoDepositado = 0;
        int montoADepositar = 2000;
        private void DepositarOtrasCuentas(object sender, EventArgs e)
        {
            String ruta = Directory.GetCurrentDirectory() + @"\Transacciones\Depositos.csv";
            try
            {
                //********** Busca la cuenta en la base de datos y compara los saldos para ver si se puede retirar esa cantidad **********
                String fechaHoy = DateTime.Now.ToString().Substring(0, 10);

                clientes clientesEmisor = dataContext.clientes.Single(x => x.codigo == Convert.ToInt32(lbl_codigoDeposito.Text));
                clientes clientesReceptor = dataContext.clientes.Single(x => x.codigo == Convert.ToInt32(txt_codigoDeposito.Text));
                monto = Convert.ToInt32(num_montoDepoOtros.Value);
                if (monto > 0)
                {
                    if (clientesEmisor.monto >= monto)
                    {
                        if (File.Exists(ruta))
                        {
                            StreamReader leer = new StreamReader(ruta);
                            int cont = 0;
                            String linea = "";
                            String[] lineas2 = new String[cont];
                            while ((linea = leer.ReadLine()) != null)
                            {
                                cont++;
                                if (linea != null)
                                {
                                    lineas2 = linea.Split(';');

                                }

                                if (lbl_codigoDeposito.Text == lineas2[0])
                                {
                                    if (fechaHoy == lineas2[5])
                                    {
                                        montoDepositado = montoDepositado + Convert.ToInt32(lineas2[4]);
                                    }
                                }

                            }
                            leer.Close();
                        }
                        if (montoDepositado <= 2000)
                        {
                            montoADepositar = 2000 - montoDepositado;
                            if (monto <= montoADepositar && montoDepositado != 2000)
                            {
                                
                                clientesEmisor.monto = clientesEmisor.monto - monto;
                                clientesReceptor.monto = clientesReceptor.monto + monto;
                                try
                                {
                                    //Monto retirado en un día
                                    dataContext.SubmitChanges();
                                    MessageBox.Show("Se han depositado con éxito: Q" + monto + ".00 a la cuenta No. " + txt_codigoDeposito.Text, "Transacción Realizada!");

                                    //Funcion para guardar
                                    guardarCSV(clientesReceptor, clientesEmisor, ruta, monto, fechaHoy);
                                    tabControl1.SelectTab(4);
                                }
                                catch (Exception ex)
                                {
                                    MessageBox.Show("No se pudo realizar la transacción", "Error!");
                                }

                            }
                            else
                            {
                                if (montoDepositado == 2000)
                                {
                                    MessageBox.Show("Solo puede depositar Q2,000.00 al día. Ya ha depositado la cantidad máxima.");

                                }
                                else
                                {
                                    MessageBox.Show("Solo puede depositar Q2,000.00 al día. Ya ha depositado: Q" + montoDepositado + ".00. Puede depositar hasta: Q" + montoADepositar + ".00");
                                }
                            }
                        }
                        else
                        {
                            MessageBox.Show("Solo puede depositar Q2,000.00 al día. Ya ha depositado la cantidad máxima");
                        }
                    }
                    else
                    {
                        MessageBox.Show("Error, su saldo es insuficiente para realizar esta transacción");
                    }
                }
                else
                {
                    MessageBox.Show("No es posible depositar Q" + monto, "Error!");
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show("Error, no se encontró la cuenta");
            }
        }

        private void guardarCSV(clientes clientesReceptor, clientes clientesEmisor, String ruta, int monto, String fechaHoy)
        {
            String registroDepositos = "";


            //codigoDepositante; usuarioDepositante; codigoRecepto; usuarioReceptor; monto; fecha

            registroDepositos = lbl_codigoDeposito.Text + ";" + clientesEmisor.usuario + ";" + txt_codigoDeposito.Text + ";" + clientesReceptor.usuario + ";" +  monto + ";" + fechaHoy + "\r\n";
            if (!File.Exists(ruta))
            {
                String registroDepositos2 = "CodigoDepositante;UsuarioDepositante;CodigoReceptor;UsuarioReceptor;Monto;Fecha\r\n";
                File.AppendAllText(ruta, registroDepositos2, Encoding.Default);
            }
            File.AppendAllText(ruta, registroDepositos, Encoding.Default);
        }
    }
}
