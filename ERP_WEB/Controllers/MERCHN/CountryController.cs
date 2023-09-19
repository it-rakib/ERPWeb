using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class CountryController : Controller
    {
        // GET: Country
        readonly string prefixed = "../MERCHN/Country";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}