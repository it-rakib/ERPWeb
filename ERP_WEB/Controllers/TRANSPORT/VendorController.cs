using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class VendorController : Controller
    {
        // GET: Vendor
        readonly string prefixed = "../TRANSPORT/Vendor";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}