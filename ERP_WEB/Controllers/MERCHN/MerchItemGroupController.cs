using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class MerchItemGroupController : Controller
    {
        // GET: MerchItemGroup
        readonly string prefixed = "../MERCHN/MerchItemGroups";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}