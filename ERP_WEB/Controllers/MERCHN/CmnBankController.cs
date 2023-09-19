using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class CmnBankController : Controller
    {
        // GET: CmnBank
        readonly string prefixed = "../MERCHN/CmnBank";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}