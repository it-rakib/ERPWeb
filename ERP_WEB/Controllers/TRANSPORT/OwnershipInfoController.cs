using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class OwnershipInfoController : Controller
    {
        // GET: OwnershipInfo
        readonly string prefixed = "../TRANSPORT/OwnershipInfo";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}