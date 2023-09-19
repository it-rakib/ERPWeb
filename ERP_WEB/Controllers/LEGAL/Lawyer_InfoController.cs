using System.Web.Mvc;

namespace ERP_WEB.Controllers.LEGAL
{
    public class Lawyer_InfoController : Controller
    {
        // GET: Lawyer_Info
        readonly string prefixed = "../LEGAL/Lawyer_Info";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}