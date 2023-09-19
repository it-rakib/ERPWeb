using BLL.HRM.Common;
using BLL.HRM.Reports;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.HRM
{
    public class ReportController : Controller
    {
        private static readonly IReportRepository _reportRepository = new ReportService();
        private static readonly ICommonRepository _commonRepository = new CommonService();
        public ActionResult EmployeeProfileReport()
        {

            if (Session["CurrentUser"] != null)
            {
                return View("../Report/EmployeeProfileReport/ProfileReportSettings");
            }

            return RedirectToAction("Logoff", "Home");
        }
        public ActionResult FacotryEmployeeProfileReport()
        {

            if (Session["CurrentUser"] != null)
            {
                return View("../Report/EmployeeProfileReport/FactoryProfileReportSettings");
            }

            return RedirectToAction("Logoff", "Home");
        }
        public ActionResult EmployeeAttendanceReport()
        {
            if (Session["CurrentUser"] != null)
            {
                return View("../Report/EmployeeAttendanceReport/EmployeeAttendanceReport");
            }

            return RedirectToAction("Logoff", "Home");
        }


    }
}