using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class CmnDistrictController : Controller
    {
        // GET: CmnDistrict
        readonly string prefixed = "../Land/CmnDistrict";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}