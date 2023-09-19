using System.Web.Mvc;

namespace ERP_WEB.Controllers.INVENTORY
{
    public class CmnStoreController : Controller
    {
        // GET: Store Details
        readonly string prefixed = "../INVENTORY/CmnStore";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}