using DAL.Common;
using DBManager;
using DBManager.AllConnection;
using Entities.LAND.LandInformationsEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.LAND.LandInformations
{
    public class LandInformationsDataService
    {
        SqlDataAdapter da;
        SqlConnection dbConn;
        SqlCommand cmd;
        DataSet ds;
        DataTable dt;
        string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["LANDDBConnectionString"].ConnectionString;
        readonly CommonDataServiceLand _common = new CommonDataServiceLand();
        public GridEntity<LandInformationsVm> GetLandInformationsSummary(GridOptions options)
        {
            var LandInformations = new GridEntity<LandInformationsVm>();

            LandInformations = KendoGrid<LandInformationsVm>.GetGridData_5(ConnectionString, options, "sp_Select_LandInformations_Grid1", "get_LandInformation_summary", "DeedNo");
            return LandInformations;
        }
    }
}
