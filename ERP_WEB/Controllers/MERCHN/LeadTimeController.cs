using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class LeadTimeController : Controller
    {
        // GET: Lead Time
        readonly string prefixed = "../MERCHN/LeadTime";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}