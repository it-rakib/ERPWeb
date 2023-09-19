using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class MerchProductTypeController : Controller
    {
        readonly string prefixed = "../MERCHN/MerchProductType";
        // GET: MerchProductType
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "home");
            return View(prefixed + "/Index");
        }
    }
}