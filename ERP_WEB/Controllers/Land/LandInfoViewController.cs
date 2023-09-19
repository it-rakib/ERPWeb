using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class LandInfoViewController : Controller
    {
        readonly string prefixed = "../Land/LandInfoView";
        // GET: Land Info View
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}