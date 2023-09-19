using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class BuyerBrandController : Controller
    {
        // GET: BuyerBrand
        readonly string prefixed = "../MERCHN/BuyerBrand";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
            //return View("../MERCHN/BuyerBrand/Index");
        }
    }
}