using System;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Windows.Forms;

namespace Cajero
{
    public partial class RegistroCuenta : Form
    {
        RegistroDataContext dataContext = new RegistroDataContext();
        String rutaIMG = Directory.GetCurrentDirectory() + @"\Imagenes";
        public RegistroCuenta()
        {
            InitializeComponent();
            tabControl1.ItemSize = new Size(0, 1);
            tabPage1.BackgroundImage = Image.FromFile(rutaIMG + @"\fondo4.png");
            tabPage2.BackgroundImage = Image.FromFile(rutaIMG + @"\fondo4.png");
        }
        //Regresar al Login por si solo querian shutear
        private void RegresarLogin(object sender, EventArgs e)
        {
            this.Hide();
            Login form = new Login();
            form.ShowDialog();
        }
        //Validar los datos personales
        private void ValidarPersonales(object sender, EventArgs e)
        {
            Regex nombreApellido = new Regex(@"\A[a-zA-Z]+\Z");
            Regex fechaNac = new Regex(@"\A((([0-2][1-9]|[1-2][0-9])/02)|([0-2][1-9]|[1-2][0-9]|3[0-1])/(01|03|05|07|08|10|12)|([0-2][1-9]|[1-2][0-9]|30)/(04|06|09|11))/(19[0-9][0-9]|200[0-5])\Z");
            Regex Telefono = new Regex(@"\A[0-9]{8}\Z");
            Regex DPI = new Regex(@"\A([0-9]{10}|[0-9]{11}|[0-9]{12}|[0-9]{13}|[0-9]{14}|[0-9]{15})\Z");
            Regex Correo = new Regex(@"\A[a-zA-Z0-9(\.|_|\-)?]+\@[a-z\-0-9\.]+\.[a-z]{3}\Z");
            
            if (txt_nombreNueva.Text != "" && txt_apellidoNueva.Text != "")
            {
                if(nombreApellido.IsMatch(txt_nombreNueva.Text) && nombreApellido.IsMatch(txt_apellidoNueva.Text))
                {
                    if(fechaNac.IsMatch(txt_fechaNueva.Text))
                    {
                        if (Telefono.IsMatch(txt_telefonoNueva.Text))
                        {
                            //Valida que el telefono no se repita
                            try
                            {
                                clientes clientesLogin = dataContext.clientes.Single(x => x.telefono == Convert.ToInt32(txt_telefonoNueva.Text));
                                MessageBox.Show("El telefono que ingresó ya existe en otra cuenta.");
                                txt_telefonoNueva.Text = "";
                            }
                            catch 
                            {
                                if(DPI.IsMatch(txt_dpiNueva.Text))
                                {
                                    //Valida que el DPI no se repita
                                    try
                                    {
                                        clientes clientesLogin = dataContext.clientes.Single(x => x.DPI == Convert.ToInt32(txt_dpiNueva.Text));
                                        MessageBox.Show("El DPI que ingresó ya existe en otra cuenta.");
                                        txt_dpiNueva.Text = "";
                                    } 
                                    catch
                                    {
                                        if (Correo.IsMatch(txt_correNueva.Text))
                                        {
                                            //Valida que el correo no se repita
                                            try
                                            {
                                                clientes clientesLogin = dataContext.clientes.Single(x => x.correo == txt_correNueva.Text);
                                                MessageBox.Show("El correo electrónico que ingresó ya existe en otra cuenta.");
                                                txt_correNueva.Text = "";
                                            }
                                            catch
                                            {
                                                try
                                                {
                                                    tabControl1.SelectTab(1);
                                                    clientes nuevoCliente = new clientes();
                                                    nuevoCliente.nombre = txt_nombreNueva.Text;
                                                    nuevoCliente.apellido = txt_apellidoNueva.Text;
                                                    nuevoCliente.fecha_de_nacimiento = txt_fechaNueva.Text;
                                                    nuevoCliente.DPI = Convert.ToInt64(txt_dpiNueva.Text);
                                                    nuevoCliente.correo = txt_correNueva.Text;
                                                    nuevoCliente.telefono = Convert.ToInt32(txt_telefonoNueva.Text);
                                                    dataContext.clientes.InsertOnSubmit(nuevoCliente);
                                                    dataContext.SubmitChanges();
                                                    MessageBox.Show("Se han ingresado con exito sus datos!", "Bien!", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                                                    txt_codigoNueva.Text = "" + nuevoCliente.codigo;
                                                }
                                                catch
                                                {
                                                    MessageBox.Show("Algo ha salido mal!", "Error!", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                                                }
                                            }
                                        }
                                        else if (txt_correNueva.Text == "")
                                        {
                                            try
                                            {
                                                tabControl1.SelectTab(1);
                                                clientes nuevoCliente = new clientes();
                                                nuevoCliente.nombre = txt_nombreNueva.Text;
                                                nuevoCliente.apellido = txt_apellidoNueva.Text;
                                                nuevoCliente.fecha_de_nacimiento = txt_fechaNueva.Text;
                                                nuevoCliente.DPI = Convert.ToInt64(txt_dpiNueva.Text);
                                                nuevoCliente.correo = " ";
                                                nuevoCliente.telefono = Convert.ToInt32(txt_telefonoNueva.Text);

                                                dataContext.clientes.InsertOnSubmit(nuevoCliente);
                                                dataContext.SubmitChanges();

                                                MessageBox.Show("Se han ingresado con exito sus datos!", "Bien!", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                                                txt_codigoNueva.Text = "" + nuevoCliente.codigo;
                                            }
                                            catch
                                            {
                                                MessageBox.Show("Algo ha salido mal!", "Error!", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                                            }
                                        }
                                        else
                                        {
                                            MessageBox.Show("El correo ingresado no es válido.");
                                            txt_correNueva.Text = "";
                                        }
                                    }
                                }
                                else
                                {
                                    MessageBox.Show("El DPI ingresado no es válido.");
                                    txt_dpiNueva.Text = "";
                                }
                            }

                        }
                        else
                        {
                            MessageBox.Show("El Teléfono ingresado no es válido.");
                            txt_telefonoNueva.Text = "";
                        }
                    }
                    else
                    {
                        MessageBox.Show("La fecha de nacimiento ingresada no es válida.");
                        txt_fechaNueva.Text = "";
                    }

                }
                else
                {
                    MessageBox.Show("El nombre y apellido únicamente pueden contener letras.");
                    txt_nombreNueva.Text = "";
                    txt_apellidoNueva.Text = "";
                }
            } else
            {
                MessageBox.Show("El campo de nombre o apellido está vacío.");
            }
        }
        //Crear la cuenta nueva cuando los datos este guchi
        Regex Usuario = new Regex(@"\A\w+\Z");
        Regex contra = new Regex(@"\A.{6,}\Z");
        Regex contra2 = new Regex(@"[A-Z]");
        Regex contra3 = new Regex(@"\A[A-Z]");
        Regex contra4 = new Regex(@"[0-9]");
        Regex contra5 = new Regex(@"(@+|_+|-+|\*|\.+|#+|\$+|\++|=+|\?+|!+|%+)");
        Regex monto = new Regex(@"\A[0-9]+\Z");

        private void CrearCuentaNueva(object sender, EventArgs e)
        {
            if(Usuario.IsMatch(txt_usuarioNueva.Text))
            {
                if(contra.IsMatch(txt_contraNueva.Text))
                {
                    if (contra2.IsMatch(txt_contraNueva.Text))
                    {
                        if (!contra3.IsMatch(txt_contraNueva.Text))
                        {
                            if (contra4.IsMatch(txt_contraNueva.Text))
                            {
                                if (contra5.IsMatch(txt_contraNueva.Text))
                                {
                                    if (!txt_contraNueva.Text.ToLower().Contains(txt_usuarioNueva.Text.ToLower()))
                                    {
                                        if (monto.IsMatch(txt_montoInicial.Text))
                                        {
                                            if (Convert.ToInt32(txt_montoInicial.Text) >= 100)
                                            {
                                                if (CB_bancoNueva.Text != "")
                                                {
                                                    try
                                                    {
                                                        clientes clientesLogin = dataContext.clientes.Single(x => x.DPI == Convert.ToInt64(txt_dpiNueva.Text));
                                                        clientesLogin.usuario = txt_usuarioNueva.Text;
                                                        clientesLogin.contraseña = txt_contraNueva.Text;
                                                        clientesLogin.banco = CB_bancoNueva.Text;
                                                        clientesLogin.monto = Convert.ToInt32(txt_montoInicial.Text);
                                                        clientesLogin.estado = true;
                                                        try
                                                        {
                                                            dataContext.SubmitChanges();
                                                            MessageBox.Show("Se ha creado su cuenta con éxito!", "Exito", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                                                            this.Hide();
                                                            Login login = new Login();
                                                            login.ShowDialog();
                                                        }
                                                        catch (Exception ex)
                                                        {
                                                            MessageBox.Show("No se pudo crear su cuenta", "Lo sentimos", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                                                        }
                                                    }
                                                    catch
                                                    {
                                                        MessageBox.Show("No se pudo crear su cuenta", "Lo sentimos", MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                                                    }
                                                } 
                                                else
                                                {
                                                    MessageBox.Show("No seleccionó ningún banco.");
                                                }
                                            }
                                            else
                                            {
                                                MessageBox.Show("El mínimo del monto inicial es Q100.00");
                                            }
                                        }
                                        else
                                        {
                                            //Monto que no sea letras
                                            MessageBox.Show("El monto ingresado no es válido.");
                                        }
                                    }
                                    else
                                    {
                                        //Else que no tenga el usuario
                                        MessageBox.Show("La contraseña no debe contener su nombre de usuario.");
                                    }
                                }
                                else
                                {
                                    //contra 5
                                    MessageBox.Show("La contraseña debe contenertener al menos un caracter especial.");
                                }
                            }
                            else
                            {
                                //contra4
                                MessageBox.Show("La contraseña debe contener al menos un número.");

                            }
                        }
                        else
                        {
                            //Contra3
                            MessageBox.Show("La contraseña no debe comenzar con mayúscula");
                        }
                    }
                    else
                    {
                        //Else contra2
                        MessageBox.Show("la contraseña debe de contener al menos una mayuscula.");
                    }
                }
                else
                {
                    //Else contra
                    MessageBox.Show("La contraseña debe de ser mayor a 6 caracteres.");
                }
            }
            else
            {
                //Else usuario
                MessageBox.Show("El usuario debe contener al menos una letra.");
            }
        }
    }
}
