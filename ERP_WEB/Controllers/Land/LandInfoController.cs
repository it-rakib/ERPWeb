using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class LandInfoController : Controller
    {
        readonly string prefixed = "../Land/LandInfo";
        // GET: LandInfo
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}