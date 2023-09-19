using System.Web.Mvc;

namespace ERP_WEB.Controllers.LEGAL
{
    public class Case_FileController : Controller
    {
        // GET: Case_File
        readonly string prefixed = "../LEGAL/Case_File";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}