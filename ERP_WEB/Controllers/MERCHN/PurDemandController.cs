using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class PurDemandController : Controller
    {
        readonly string prefixed = "../MERCHN/PurDemand";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/PurDemandSettings");
        }
    }
}