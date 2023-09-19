using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class CmnCurrencyController : Controller
    {
        // GET: CmnCurrency
        readonly string prefixed = "../MERCHN/CmnCurrency";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}