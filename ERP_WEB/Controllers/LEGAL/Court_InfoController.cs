using System.Web.Mvc;

namespace ERP_WEB.Controllers.LEGAL
{
    public class Court_InfoController : Controller
    {
        // GET: Court
        readonly string prefixed = "../LEGAL/Court_Info";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}