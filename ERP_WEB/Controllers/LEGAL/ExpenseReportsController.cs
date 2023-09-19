using AUtilities;
using BLL.LEGAL.Reports;
using ERP_WEB.LegalReports.Entity;
using System.Linq;
using System.Web.Mvc;
using DBManager;
using Entities.LEGAL.ReportEntity;

namespace ERP_WEB.Controllers.LEGAL
{
    public class ExpenseReportsController : Controller
    {
        // GET: ExpenseReport
        readonly string prefixed = "../LEGAL/ExpenseReports";
        readonly IExpenseReportRepository _expenseReportRepository = new ExpenseReportService();
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }

        public void GetAllExpenseDataByDate(string fromDate,string toDate, int fileType, int court, int caseNo)
        {
            ReportParams<ExpenseReports> objReportParams = new ReportParams<ExpenseReports>();
            var ds = _expenseReportRepository.GetAllExpenseDataByDate(fromDate, toDate, fileType, court, caseNo);
            var data = ListConversion.ConvertTo<ExpenseReports>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptExpenseReport.rpt";

            this.HttpContext.Session["ReportType"] = "rptExpenseReport";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }

        public JsonResult GetAllExpenseGridDataByDate(GridOptions options, string fromDate, string toDate,int fileType,int court,int caseNo)
        {
            var res = _expenseReportRepository.GetAllExpenseInfoGridDataByDate(options,fromDate,toDate, fileType,court,caseNo);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
    }
}