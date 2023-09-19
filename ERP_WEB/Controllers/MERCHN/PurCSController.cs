using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class PurCSController : Controller
    {
        readonly string prefixed = "../MERCHN/PurCS";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/PurCSSettings");
        }
    }
}
