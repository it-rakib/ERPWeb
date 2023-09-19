using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class MerchItemCategoryController : Controller
    {
        // GET: MerchItemCategory
        readonly string prefixed = "../MERCHN/MerchItemCategory";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}