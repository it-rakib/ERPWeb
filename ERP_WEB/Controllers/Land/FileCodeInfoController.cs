using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class FileCodeInfoController : Controller
    {
        // GET: FileCodeInfo
        readonly string prefixed = "../Land/FileCodeInfo";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff","Home");
            return View(prefixed + "/Index");
        }
    }
}