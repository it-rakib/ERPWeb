using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class CmnUomController : Controller
    {
        // GET: CmnUom
        readonly string prefixed = "../MERCHN/CmnUom";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}