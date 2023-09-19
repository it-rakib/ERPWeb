using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class ComGroupLcController : Controller
    {
        // GET: ComGroupLc
        readonly string prefixed = "../MERCHN/ComGroupLc";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}