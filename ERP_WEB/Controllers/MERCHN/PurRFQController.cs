using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class PurRFQController : Controller
    {
        readonly string prefixed = "../MERCHN/PurRFQ";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/PurRFQSettings");
        }
    }
}