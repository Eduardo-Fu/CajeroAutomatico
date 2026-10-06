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
    public partial class Menu_Inicio : Form
    {
        String rutaIMG = Directory.GetCurrentDirectory() + @"\Imagenes";
        public Menu_Inicio()
        {
            InitializeComponent();
            this.BackgroundImage = Image.FromFile(rutaIMG + @"\fondo1.png" );
        }

        private void CerrarSesion(object sender, EventArgs e)
        {
            this.Hide();
            Login form = new Login();
            form.ShowDialog();
        }

        private void Retiro(object sender, EventArgs e)
        {
            this.Hide();
            Retiro form = new Retiro();
            AddOwnedForm(form);
            form.lbl_codigoRetiro.Text = this.lbl_codigoMenu.Text;
            form.lbl_codigoRetiro2.Text = this.lbl_codigoMenu.Text;
            form.ShowDialog();
        }

        private void Consulta(object sender, EventArgs e)
        {
            this.Hide();
            Consulta form = new Consulta();
            AddOwnedForm(form);
            form.lbl_codigoConsulta.Text = this.lbl_codigoMenu.Text;
            form.ShowDialog();
        }

        private void Deposito(object sender, EventArgs e)
        {
            this.Hide();
            Deposito form = new Deposito();
            AddOwnedForm(form);
            form.lbl_codigoDeposito.Text = this.lbl_codigoMenu.Text;
            form.lbl_codigoDeposito2.Text = this.lbl_codigoMenu.Text;
            form.lbl_codigoDeposito3.Text = this.lbl_codigoMenu.Text;
            form.lbl_codigoDeposito4.Text = this.lbl_codigoMenu.Text;
            form.ShowDialog();
        }
    }
}
