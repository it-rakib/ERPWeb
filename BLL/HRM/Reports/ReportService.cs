using DAL.Common;
using DAL.HRM;

namespace BLL.HRM.Reports
{
    public class ReportService : IReportRepository
    {
        private static readonly ReportDataService _ReportDataService = new ReportDataService();
        private CommonDataServiceHRM _common = new CommonDataServiceHRM();

    }
}
