using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class DocTypeController : Controller
    {
        // GET: CmnDocType
        readonly string prefixed = "../MERCHN/CmnDocType";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}