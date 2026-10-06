using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.Linq;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Cajero
{
    public partial class Login : Form
    {
        RegistroDataContext dataContext = new RegistroDataContext();
        String rutaIMG = Directory.GetCurrentDirectory() + @"\Imagenes";
        String rutaPDF = Directory.GetCurrentDirectory() + @"\Manual";
        public Login()
        {

            InitializeComponent();
            pictureBox1.Image = Image.FromFile(rutaIMG+@"\logo.png");
            this.BackgroundImage = Image.FromFile(rutaIMG+@"\fondo.png");

            
        }
        //Contador de las veces que te puedes equivocar Fu!
        int contraIncorrecta = 3;
        String verCodigo = "";
        private void Iniciar_Sesion(object sender, EventArgs e)
        {
            try
            {
                //*********** Busca el cliente con el código ***********
                clientes clientesLogin = dataContext.clientes.Single(x => x.codigo == Convert.ToInt32(txt_codigoLogin.Text));

                //*********** Permite restablecer el contador de errores en caso se cambie de cuenta ***********
                if (verCodigo != txt_codigoLogin.Text)
                {
                    contraIncorrecta = 3;
                    lbl_mensajePass.Text = "Intentos restantes " + contraIncorrecta + ".";
                }

                //*********** Valida si el usuario ingresado es correcto ***********
                if (clientesLogin.usuario == txt_usuarioLogin.Text)
                {
                    //*********** Valida si la contraseña es correcta ***********
                    if (clientesLogin.contraseña == txt_contraLogin.Text)
                    {
                        if (clientesLogin.estado == false)
                        {
                            MessageBox.Show("Su cuenta esta bloqueada");
                        }
                        else
                        {
                            //*********** Todo está correcto, ingresa al menú principal ***********
                            this.Hide();
                            Menu_Inicio menu = new Menu_Inicio();
                            AddOwnedForm(menu);
                            menu.lbl_codigoMenu.Text = this.txt_codigoLogin.Text;
                            menu.ShowDialog();
                        }
                    }

        //***************** Validamos Errores ****************
                    else
                    {
                        MessageBox.Show("Contraseña Incorrecta");
                        contraIncorrecta--;
                        lbl_mensajePass.Text = "Intentos restantes " + contraIncorrecta + ".";
                        txt_contraLogin.Text = "";
                        verCodigo = txt_codigoLogin.Text;
                    }
                }
                else
                {
                    MessageBox.Show("Usuario Incorrecto");
                    txt_usuarioLogin.Text = "";
                }

                //*********** Bloquea la cuenta si se pasa de los intentos ***********
                if (contraIncorrecta == 0)
                {
                    clientesLogin.estado = false;
                }
            }catch (Exception ex) {
                MessageBox.Show("Codigo Incorrecto");
                txt_codigoLogin.Text = "";
            }
        }
//  ***************** Botón salir ****************
        private void Salir(object sender, EventArgs e)
        {
            this.Close();
            Application.Exit();
        }
        //***************** Registra al nuevo usuario ****************
        private void Registrarse(object sender, EventArgs e)
        {
            this.Hide();
            RegistroCuenta registroCuenta = new RegistroCuenta();
            registroCuenta.ShowDialog();
        }

        private void AbrirManual(object sender, EventArgs e)
        {
            Process.Start(rutaPDF+@"\reporte.pdf");
        }
    }
}
