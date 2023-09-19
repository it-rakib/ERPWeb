using DAL.Common;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DAL.HRM
{
    public class ReportDataService
    {
        private SqlDataAdapter da;
        private SqlConnection dbConn;
        private SqlCommand cmd;
        private DataSet ds;
        private DataTable dt;
        private readonly CommonDataService _common = new CommonDataService("SqlConnectionStringHRM");

        private string ConnectionString = ConfigurationManager.ConnectionStrings["SqlConnectionStringHRM"].ConnectionString;


    }
}
