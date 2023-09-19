using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class DriverPerformanceController : Controller
    {
        // GET: DriverPerformance
        readonly string prefixed = "../TRANSPORT/DriverPerformance";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}