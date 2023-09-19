using DAL.Common;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBManager;
using Entities.LEGAL.LegalDashboardEntity;
using System.Data.SqlClient;
using DBManager.AllConnection;

namespace DAL.LEGAL.LegalDashboard
{
    public  class LegalDashboardDataService
    {
        private SqlDataAdapter da;
        private SqlConnection dbConn;
        private SqlCommand cmd;
        private DataSet ds;
        private DataTable dt;
        private readonly CommonDataService _common = new CommonDataService("LEGALDBConnectionString");

        private string ConnectionString = ConfigurationManager.ConnectionStrings["LEGALDBConnectionString"].ConnectionString;


        public GridEntity<LegalDashboardVm> GetAllOverDatedGridData(GridOptions options)
        {
            var dashboardOverDated = new GridEntity<LegalDashboardVm>();

            dashboardOverDated = KendoGrid<LegalDashboardVm>.GetGridData_5(ConnectionString, options, "sp_Select_OverdatedCase_Grid", "get_OverdatedCase_summary", "NextDate");
            return dashboardOverDated;
        }
    }
}
