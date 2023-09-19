using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class BrandDepartmentController : Controller
    {
        readonly string prefixed = "../MERCHN/BrandDepartment";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}