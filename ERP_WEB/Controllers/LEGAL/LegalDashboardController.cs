using System.Web.Mvc;
using BLL.LEGAL.LegalDashboard;
using DBManager;

namespace ERP_WEB.Controllers.LEGAL
{
    public class LegalDashboardController : Controller
    {
        private readonly ILegalDashboardRepository _dashboardRepository = new LegalDashboardService();
        // GET: LegalDashboard
        private readonly string prefixed = "../Dashboard/LegalDashboard";

        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }

        public JsonResult GetAllOverDatedGridData(GridOptions options)
        {
            var res = _dashboardRepository.GetAllOverDatedGridData(options);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
    }
}