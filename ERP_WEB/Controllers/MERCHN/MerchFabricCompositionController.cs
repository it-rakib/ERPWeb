using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class MerchFabricCompositionController : Controller
    {
        // GET: MerchFabricComposition
        readonly string prefixed = "../MERCHN/MerchFabricComposition";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}