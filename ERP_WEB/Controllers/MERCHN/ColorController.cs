using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class ColorController : Controller
    {
        // GET: CmnColor
        readonly string prefixed = "../MERCHN/CmnColor";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}