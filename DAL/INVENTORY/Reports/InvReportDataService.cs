using DAL.Common;
using DBManager;
using Entities.LAND.ReportEntity;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.INVENTORY.Reports
{
    public class InvReportDataService
    {
        private SqlDataAdapter da;
        private SqlConnection dbConn;
        private SqlCommand cmd;
        private DataSet ds;
        private DataTable dt;
        private readonly CommonDataService _common = new CommonDataService("INVConnectionString");

        private string connectionString = ConfigurationManager.ConnectionStrings["INVConnectionString"].ConnectionString;
        public DataSet GetMovementReport(string condition)
        {
            string sql = "";

            sql = String.Format(@"SELECT ib.*,StoreName,BuyerName,StyleNo,ItemName,SizeName,ColorName,UOMName,ShadeName,
		        (MRRQty+ReceiveQty+SubCReceiveQty+LoanReceiveQty+TransferInQty+ReturnToStoreQty+LeftOverReceiveQty) TotalReceiveQty,
		        (MRRValue+ReceiveValue+SubCReceiveValue+LoanReceiveValue+TransferInValue+ReturnToStoreValue+LeftOverReceiveValue) TotalReceiveValue,
		        (IssueQty+SubCIssueQty+RetrunfrmSubCQty+LoanIssueQty+TransferOutQty+SampleIssueQty+LoanReturnQty+RetrunfrmFlrQty+RetruntoSplQty+LeftOverIssueQty) TotalIssueQty,
		        (IssueValue+SubCIssueValue+RetrunfrmSubCValue+LoanIssueValue+TransferOutValue+SampleIssueValue+LoanReturnValue+RetrunfrmFlrValue+RetrunToSplValue+LeftOverIssueValue) TotalIssueValue
		        FROM InvStyleWiseItemBalance ib
		        LEFT JOIN CmnStore st ON st.StoreId=ib.StoreId
		        LEFT JOIN ERPMarchDB.dbo.Buyer b ON b.BuyerId=ib.BuyerId
		        LEFT JOIN ERPMarchDB.dbo.StyleDetails sd ON sd.StyleDetailId=ib.StyleDetailsId
		        LEFT JOIN ERPMarchDB.dbo.StyleMaster sm ON sm.StyleId=sd.StyleId
		        LEFT JOIN ERPMarchDB.dbo.CmnColor c ON c.ColorId=ib.ColorId
		        LEFT JOIN ERPMarchDB.dbo.CmnSize s ON s.SizeId=ib.SizeId
		        LEFT JOIN ERPMarchDB.dbo.CmnUOM u ON u.UOMId=ib.UOMId
		        LEFT JOIN InvShade sh ON sh.ShadeId=ib.ShadeId
		        LEFT JOIN ERPMarchDB.dbo.MerchItem i ON i.ItemId=ib.ItemId 
                {0}", condition);
            
            return _common.GetDataSet(sql);
            //return _common.select_data_10("","Sp_LandReport", "get_district_wise_report");
        }
    }
}
