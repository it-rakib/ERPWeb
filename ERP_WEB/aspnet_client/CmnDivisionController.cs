using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class CmnDivisionController : Controller
    {
        // GET: CmnDivision Controller
        readonly string prefixed = "../Land/CmnDivision";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}