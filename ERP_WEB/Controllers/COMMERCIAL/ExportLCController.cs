using System.Web.Mvc;

namespace ERP_WEB.Controllers.COMMERCIAL
{
    public class ExportLCController : Controller
    {
        readonly string prefixed = "../COMMERCIAL/ComExportLC";
        // GET: StyleMaster
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/ExportLCSettings");
        }
    }
}