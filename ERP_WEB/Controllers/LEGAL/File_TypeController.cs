using System.Web.Mvc;

namespace ERP_WEB.Controllers.LEGAL
{
    public class File_TypeController : Controller
    {
        // GET: File_Type
        readonly string prefixed = "../LEGAL/File_Type";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}