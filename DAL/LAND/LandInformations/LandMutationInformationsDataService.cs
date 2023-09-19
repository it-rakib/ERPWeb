using DAL.Common;
using DBManager;
using Entities.LAND.LandInformationsEntity;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBManager.AllConnection;

namespace DAL.LAND.LandInformations
{
    public class LandMutationInformationsDataService
    {
        SqlDataAdapter da;
        SqlConnection dbConn;
        SqlCommand cmd;
        DataSet ds;
        DataTable dt;
        string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["LANDDBConnectionString"].ConnectionString;
        readonly CommonDataServiceLand _common = new CommonDataServiceLand();
        public GridEntity<LandInformationsVm> GetMutationLandInformationsSummary(GridOptions options)
        {
            var LandInformations = new GridEntity<LandInformationsVm>();

            LandInformations = KendoGrid<LandInformationsVm>.GetGridData_5(ConnectionString, options, "sp_Select_LandMutationInformations_Grid1", "get_LandMutationInformation_summary", "DeedNo");
            return LandInformations;
        }
    }
}
