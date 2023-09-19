using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class MerchProductCategoryController : Controller
    {
        // GET: MerchProductCategory
        readonly string prefixed = "../MERCHN/MerchProductCategory";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}