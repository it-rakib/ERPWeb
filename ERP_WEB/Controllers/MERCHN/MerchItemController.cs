using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class MerchItemController : Controller
    {
        // GET: MerchItem
        readonly string prefixed = "../MERCHN/MerchItems";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}