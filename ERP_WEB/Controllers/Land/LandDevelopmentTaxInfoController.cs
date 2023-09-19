using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class LandDevelopmentTaxInfoController : Controller
    {
        readonly string prefixed = "../Land/LandDevelopmentTaxInfo";
        // GET: Land Development Tax Info
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}