using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class FabricTypesController : Controller
    {
        // GET: FabricTypes
        readonly string prefixed = "../MERCHN/FabricTypes";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}