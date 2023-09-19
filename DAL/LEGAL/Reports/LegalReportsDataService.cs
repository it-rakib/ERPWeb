using DAL.Common;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBManager;
using Entities.LEGAL.ReportEntity;
using Entities.LAND.LandInformationsEntity;
using DBManager.AllConnection;

namespace DAL.LEGAL.Reports
{
    public class LegalReportsDataService
    {
        private SqlDataAdapter da;
        private SqlConnection dbConn;
        private SqlCommand cmd;
        private DataSet ds;
        private DataTable dt;
        private readonly CommonDataService _common = new CommonDataService("LEGALDBConnectionString");

        private string ConnectionString = ConfigurationManager.ConnectionStrings["LEGALDBConnectionString"].ConnectionString;

        public GridEntity<DateWiseExpenseReport> GetAllExpenseInfoGridDataByDate(GridOptions options, string fromDate, string toDate, int fileType, int court, int caseNo, string condition)
        {
            var expenseInfo = new GridEntity<DateWiseExpenseReport>();
            expenseInfo = KendoGrid<DateWiseExpenseReport>.GetGridData_5(ConnectionString, options, "ExpenseReportGrid", "get_ExpenseInfoGrid_summary", "ExpenseDate",condition);
            return expenseInfo;
        }

        public DataSet GetAllExpenseDataByDate(string fromDate, string toDate, int fileType, int court, int caseNo, string condition)
        {
            return _common.select_data_10("", "ExpenseReport", "get_date_wise_expense_report", fromDate,toDate,fileType.ToString(),court.ToString(),caseNo.ToString(),condition);
        }

        public DataSet GetAllCaseData(int fileType, int court, int status, int unit, int assignLawyer, bool isPublish, int district, int matter,string condition)
        {
            return _common.select_data_10("", "CaseReport", "get_case_report", fileType.ToString(), court.ToString(), status.ToString(), unit.ToString(), assignLawyer.ToString(), isPublish.ToString(), district.ToString(),matter.ToString(), condition);
        }

        public GridEntity<CaseFilesVm> GetCaseFileReportGrid(GridOptions options, int fileType, int court,int status, int unit,string condition)
        {
            var caseFileInfo = new GridEntity<CaseFilesVm>();
            caseFileInfo = KendoGrid<CaseFilesVm>.GetGridData_5(ConnectionString, options, "CaseReportGrid", "get_case_reportGrid", "", fileType.ToString(), court.ToString(),status.ToString(),unit.ToString(), condition);
            return caseFileInfo;
        }
    }
}
