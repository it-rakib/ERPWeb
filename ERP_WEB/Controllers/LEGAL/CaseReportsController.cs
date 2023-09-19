using AUtilities;
using BLL.LEGAL.Reports;
using DBManager;
using ERP_WEB.LegalReports.Entity;
using System.Linq;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.LEGAL
{
    public class CaseReportsController : Controller
    {
        // GET: CaseReports
        readonly string prefixed = "../LEGAL/CaseReports";
        readonly ICaseReportRepository _caseReportRepository = new CaseReportService();
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }

        public void GetAllCaseData(int fileType,int court,int status,int unit,int assignLawyer,bool isPublish,int district,int matter)
        {
            ReportParams<CaseReport> objReportParams = new ReportParams<CaseReport>();
            var ds = _caseReportRepository.GetAllCaseData(fileType, court, status, unit, assignLawyer,isPublish,district,matter);
            var data = ListConversion.ConvertTo<CaseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptCaseReport.rpt";

            this.HttpContext.Session["ReportType"] = "rptCaseReport";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }

        public JsonpResult GetCaseFileReportGrid(GridOptions options, int fileType, int court, int status, int unit)
        {
            var res = _caseReportRepository.GetCaseFileReportGrid(options, fileType, court, status, unit);
            return (JsonpResult)Json(res, JsonRequestBehavior.AllowGet);
        }
    }
}