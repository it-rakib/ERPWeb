using DAL.LAND.Reports;
using DAL.LEGAL.Reports;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBManager;
using Entities.LEGAL.ReportEntity;

namespace BLL.LEGAL.Reports
{
    public class ExpenseReportService : IExpenseReportRepository
    {
        readonly LegalReportsDataService _legalReportsDataService = new LegalReportsDataService();

        public DataSet GetAllExpenseDataByDate(string fromDate, string toDate, int fileType, int court, int caseNo)
        {
            int a = 0;
            string condition = String.Format(@" Where b.IsDeleted = 0 ");
            string query = "";

            if (fromDate != null || fromDate != "" && toDate != null || toDate != "")
            {
                condition += (@"AND a.ExpenseDate between convert(Date," + "'" + fromDate + "'" + ",103) and convert(Date," + "'" + toDate + "'" + ",103)");
                //condition += @"a.ExpenseDate between '"+fromDate+"' and '"+ toDate+"'"; //convert(Date,'01-01-2023',103)
                a++;
            }
            if (fileType > 0)
            {
                if (fromDate != null || fromDate != "" && toDate != null || toDate != "")
                {
                    condition += " AND b.FileTypeId = '" + fileType + "'";
                }
                else
                {
                    condition += "AND b.FileTypeId = '" + fileType + "'";
                }
                a++;
            }
            if (court > 0)
            {
                if (fromDate != null || fromDate != "" && toDate != null || toDate != "" || fileType > 0)
                {
                    condition += " AND b.CourtId = '" + court + "'";
                }
                else
                {
                    condition += "AND b.CourtId = '" + court + "'";
                }
                a++;
            }

            if (caseNo > 0)
            {
                if (fromDate != null || fromDate != "" && toDate != null || toDate != "" || fileType > 0 || court > 0)
                {
                    condition += " AND b.FileMasterId = '" + caseNo + "'";
                }
                else
                {
                    condition += "AND b.FileMasterId = '" + caseNo + "'";
                }
                a++;
            }

            if (a == 0)
            {
                condition = "Where 1=1";
            }
            return _legalReportsDataService.GetAllExpenseDataByDate(fromDate, toDate, fileType, court, caseNo, condition);
        }

        public GridEntity<DateWiseExpenseReport> GetAllExpenseInfoGridDataByDate(GridOptions options, string fromDate, string toDate, int fileType, int court, int caseNo)
        {
            int a = 0;
            string condition = String.Format(@" Where ");
            string query = "";

            if (fromDate != null || fromDate != "" && toDate != null || toDate != "")
            {
                condition += (@"a.ExpenseDate between convert(Date," + "'" + fromDate + "'" + ",103) and convert(Date," + "'" + toDate + "'"+  ",103)");
                //condition += @"a.ExpenseDate between '"+fromDate+"' and '"+ toDate+"'"; //convert(Date,'01-01-2023',103)
                a++;
            }
            if (fileType > 0)
            {
                if (fromDate != null || fromDate != "" && toDate != null || toDate != "")
                {
                    condition += " AND b.FileTypeId = '" + fileType + "'";
                }
                else
                {
                    condition += "b.FileTypeId = '" + fileType + "'";
                }
                a++;
            }
            if (court > 0)
            {
                if (fromDate != null || fromDate != "" && toDate != null || toDate != "" || fileType > 0)
                {
                    condition += " AND b.CourtId = '" + court + "'";
                }
                else
                {
                    condition += "b.CourtId = '" + court + "'";
                }
                a++;
            }

            if (caseNo > 0)
            {
                if (fromDate != null || fromDate != "" && toDate != null || toDate != "" || fileType > 0 || court > 0)
                {
                    condition += " AND b.FileMasterId = '" + caseNo + "'";
                }
                else
                {
                    condition += "b.FileMasterId = '" + caseNo + "'";
                }
                a++;
            }
            
            if (a == 0)
            {
                condition = "Where 1=1";
            }
            return _legalReportsDataService.GetAllExpenseInfoGridDataByDate(options, fromDate, toDate,fileType,court,caseNo,condition);
        }
    }
}
