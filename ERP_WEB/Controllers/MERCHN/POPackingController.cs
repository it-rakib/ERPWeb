using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class POPackingController : Controller
    {
        readonly string prefixed = "../MERCHN/POPacking";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}