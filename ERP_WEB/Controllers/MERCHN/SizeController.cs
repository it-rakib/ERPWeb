using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class SizeController : Controller
    {
        // GET: Size
        readonly string prefixed = "../MERCHN/CmnSize";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}