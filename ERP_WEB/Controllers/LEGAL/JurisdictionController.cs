using System.Web.Mvc;

namespace ERP_WEB.Controllers.LEGAL
{
    public class JurisdictionController : Controller
    {
        // GET: Jurisdiction
        readonly string prefixed = "../LEGAL/Jurisdiction";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}