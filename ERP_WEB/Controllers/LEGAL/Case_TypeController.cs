using System.Web.Mvc;

namespace ERP_WEB.Controllers.LEGAL
{
    public class Case_TypeController : Controller
    {
        // GET: Case_Type
        readonly string prefixed = "../LEGAL/Case_Type";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}