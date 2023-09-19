using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class MerchProductController : Controller
    {
        // GET: MerchProduct
        readonly string prefixed = "../MERCHN/MerchProduct";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}