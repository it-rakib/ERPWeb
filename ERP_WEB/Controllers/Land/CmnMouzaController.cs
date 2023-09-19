using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class CmnMouzaController : Controller
    {
        readonly string prefixed = "../Land/CmnMouza";
        // GET: CmnMouza
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}