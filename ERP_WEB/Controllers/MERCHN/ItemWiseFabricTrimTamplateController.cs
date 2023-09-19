using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class ItemWiseFabricTrimTamplateController : Controller
    {
        // GET: ItemWiseFabricTrimTamplate
        readonly string prefixed = "../MERCHN/ItemWiseFabricTrimTamplate";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}