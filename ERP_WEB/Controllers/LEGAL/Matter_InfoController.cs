using System.Web.Mvc;

namespace ERP_WEB.Controllers.LEGAL
{
    public class Matter_InfoController : Controller
    {
        // GET: Matter_Info
        readonly string prefixed = "../LEGAL/Matter_Info";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}