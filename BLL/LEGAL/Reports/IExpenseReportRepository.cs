using System.Data;
using DBManager;
using Entities.LEGAL.ReportEntity;

namespace BLL.LEGAL.Reports
{
    public interface IExpenseReportRepository
    {
        DataSet GetAllExpenseDataByDate(string fromDate, string toDate, int fileType, int court, int caseNo);
        GridEntity<DateWiseExpenseReport> GetAllExpenseInfoGridDataByDate(GridOptions options, string fromDate, string toDate, int fileType, int court, int caseNo);
    }
}
