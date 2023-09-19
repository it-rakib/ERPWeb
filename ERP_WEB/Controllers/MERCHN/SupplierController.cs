using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class SupplierController : Controller
    {
        // GET: Supplier
        readonly string prefixed = "../MERCHN/Supplier";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}