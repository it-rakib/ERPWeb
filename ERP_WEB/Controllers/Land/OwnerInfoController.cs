using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class OwnerInfoController : Controller
    {
        // GET: Owner Info
        readonly string prefixed = "../Land/OwnerInfo";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}