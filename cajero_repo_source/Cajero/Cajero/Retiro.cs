using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.Linq;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Cajero
{
    public partial class Retiro : Form
    {
        String rutaIMG = Directory.GetCurrentDirectory() + @"\Imagenes";
        RegistroDataContext dataContext = new RegistroDataContext();
        public Retiro()
        {
            InitializeComponent();
            tabControl1.ItemSize = new Size(0, 1);
            tabPage1.BackgroundImage = Image.FromFile(rutaIMG+@"\fondo1.png");
            tabPage2.BackgroundImage = Image.FromFile(rutaIMG+@"\fondo1.png");
            tabPage5.BackgroundImage = Image.FromFile(rutaIMG+@"\fondo1.png");
        }


        //****************** Botón para cambiar a la pantalla de retirar otra cantidad *******************************
        private void RetirarOtraCantidad(object sender, EventArgs e)
        {
            tabControl1.SelectTab(1);
        }

        //****************** Boton para retirar la cantidad ingresada *************************************************
        private void RetirarOtraCant(object sender, EventArgs e)
        {
            montoRetirado = 0;
            montoARetirar = 3000;
            //************ Valida si el monto son múltiplos de 50 ***********
            if ((num_montoRetirar.Value % 50) == 0)
            {
                retirarr(Convert.ToInt32(num_montoRetirar.Value));

            } else
            {
                MessageBox.Show("Error, Sólo puede retirar en múltiplos de 50");

            }
        }

        // *************************************** Regresa al menu principal ******************************************************************************
        private void VolverMenu(object sender, EventArgs e)
        {
            this.Hide();
            Menu_Inicio form = new Menu_Inicio();
            AddOwnedForm(form);
            form.lbl_codigoMenu.Text = this.lbl_codigoRetiro.Text;
            form.ShowDialog();
        }

        //******************************************** Regresa al Login ***********************************************************************************
        private void CerrarSesion(object sender, EventArgs e)
        {
            this.Hide();
            Login form = new Login();
            form.ShowDialog();
        }


        // ********************************************* Retira el saldo con el monto indicado ************************************************************
        private void Retirar(object sender, EventArgs e)
        {
            Button aux = (Button)sender;
            try
            {
                //********** Busca la cuenta en la base de datos y compara los saldos para ver si se puede retirar esa cantidad **********
                montoRetirado = 0;
                montoARetirar = 3000;

                switch (aux.Text)
                {
                    case "Q50.00":
                        retirarr(50);
                        break;
                    case "Q100.00":
                        retirarr(100);
                        break;
                    case "Q200.00":
                        retirarr(200);
                        break;
                    case "Q400.00":
                        retirarr(400);
                        break;
                    case "Q600.00":
                        retirarr(600);
                        break;
                    case "Q1000.00":
                        retirarr(1000);
                        break;
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show("Error, no se encontró el saldo de la cuenta");
            }
        }
        int ultimoMonto = 0;
        int montoRetirado = 0;
        int montoARetirar = 3000;
        private void retirarr(int monto)
        {
            String ruta = Directory.GetCurrentDirectory() + @"\Transacciones\Retiros.csv";
            try
            {
                //********** Busca la cuenta en la base de datos y compara los saldos para ver si se puede retirar esa cantidad **********
                String fechaHoy = DateTime.Now.ToString().Substring(0,10);
                
                clientes clientesLogin = dataContext.clientes.Single(x => x.codigo == Convert.ToInt32(lbl_codigoRetiro.Text));
                if(monto > 0)
                {
                    if (clientesLogin.monto >= monto)
                    {
                        if (File.Exists(ruta))
                        {
                            StreamReader leer = new StreamReader(ruta);
                            int cont = 0;
                            String linea = "";
                            String[] lineas2 = new String[cont];
                            while((linea = leer.ReadLine()) != null)
                            {
                                cont++;
                                if (linea != null)
                                { 
                                    lineas2 = linea.Split(';');
                                        
                                }

                                if (lbl_codigoRetiro.Text == lineas2[0])
                                {
                                    if(fechaHoy == lineas2[4])
                                    { 
                                        montoRetirado = montoRetirado + Convert.ToInt32(lineas2[3]);
                                    }
                                }

                            }
                            leer.Close();
                        }
                        if(montoRetirado <= 3000)
                        {
                            montoARetirar = 3000 - montoRetirado;
                            if(monto <= montoARetirar && montoRetirado != 3000)
                            {
                                clientesLogin.monto = clientesLogin.monto - monto;
                                try
                                {
                                    //Monto retirado en un día
                                    dataContext.SubmitChanges();
                                    MessageBox.Show("Se han retirado con éxito: Q" + monto + ".00", "Transacción Realizada!");

                                    //Funcion para guardar
                                    guardarCSV(clientesLogin, ruta, monto, fechaHoy);
                                    tabControl1.SelectTab(2);
                                }
                                catch (Exception ex)
                                {
                                    MessageBox.Show("No se pudo realizar la transacción", "Error!");
                                }

                            }
                            else
                            {
                                if(montoRetirado == 3000)
                                {
                                    MessageBox.Show("Solo puede retirar Q3,000.00 al día. Ya ha retirado la cantidad máxima.");
                                }
                                else
                                {
                                    MessageBox.Show("Solo puede retirar Q3,000.00 al día. Ya ha retirado: Q" + montoRetirado + ".00. Puede retirar hasta: Q" + montoARetirar + ".00");
                                }
                            }
                        } 
                        else
                        {
                            MessageBox.Show("Solo puede retirar Q3,000.00 al día. Ya ha retirado la cantidad máxima");
                        }
                    }
                    else
                    {
                        MessageBox.Show("Error, su saldo es insuficiente para realizar esta transacción");
                    }
                }
                else
                {
                    MessageBox.Show("No es posible retirar Q" + monto, "Error!");
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show("Error, no se encontró la cuenta");
            }
        }

        private void guardarCSV(clientes clientesLogin, String ruta, int monto, String fechaHoy)
        {
            String registroRetiros = "";
            

            //codigo; nombre; apellido; monto; fecha

            registroRetiros = lbl_codigoRetiro.Text + ";" + clientesLogin.nombre + ";" + clientesLogin.apellido + ";" + monto + ";" + fechaHoy + "\r\n";
            if (!File.Exists(ruta))
            {
                String registroRetiros2 = "Codigo;Nombre;Apellido;Monto Retirado;Fecha\r\n";
                File.AppendAllText(ruta, registroRetiros2, Encoding.Default);
            }
            File.AppendAllText(ruta, registroRetiros, Encoding.Default);
        }

    }
}
