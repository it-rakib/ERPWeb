using System.Web.Mvc;

namespace ERP_WEB.Controllers.LEGAL
{
    public class PetitionerController : Controller
    {
        // GET: Petitioner
        readonly string prefixed = "../LEGAL/Petitioner";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}