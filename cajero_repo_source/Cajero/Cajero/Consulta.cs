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
    public partial class Consulta : Form
    {
        RegistroDataContext dataContext = new RegistroDataContext();
        String rutaIMG = Directory.GetCurrentDirectory() + @"\Imagenes";
        public Consulta()
        {
            InitializeComponent();
            this.BackgroundImage = Image.FromFile(rutaIMG + @"\fondo3.png");
        }

       
        private void VolverMenu(object sender, EventArgs e)
        {
            this.Hide();
            Menu_Inicio form = new Menu_Inicio();
            AddOwnedForm(form);
            form.lbl_codigoMenu.Text = this.lbl_codigoConsulta.Text;
            form.ShowDialog();
        }

        private void CerrarSesion(object sender, EventArgs e)
        {
            this.Hide();
            Login form = new Login();
            form.ShowDialog();
        }


        //evento Load
        private void FormConsulta(object sender, EventArgs e)
        {
            try
            {
                clientes clientesLogin = dataContext.clientes.Single(x => x.codigo == Convert.ToInt32(lbl_codigoConsulta.Text));
                lbl_saldo.Text = "Q " + clientesLogin.monto + ".00";
                lbl_nombreConsulta.Text = clientesLogin.usuario;
                var tabla = from datos in dataContext.GetTable<clientes>()
                            where datos.codigo == Convert.ToInt32(lbl_codigoConsulta.Text)
                            select datos;

                dataGridView1.DataSource = tabla;

            }
            catch (Exception ex)
            {
                MessageBox.Show("No pudo realizarse la consulta", "Error");
            }
        }

    }
}
