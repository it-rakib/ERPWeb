using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class PurSupplierItemController : Controller
    {
        // GET: PurSupplierItem
        readonly string prefixed = "../MERCHN/PurSupplierItem";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}