using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class FileLocationController : Controller
    {
        readonly string prefixed = "../Land/FileLocation";
        // GET: File Location
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}