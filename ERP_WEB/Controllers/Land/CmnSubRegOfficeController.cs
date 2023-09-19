using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class CmnSubRegOfficeController : Controller
    {
        readonly string prefixed = "../Land/CmnSubRegOffice";
        // GET: Sub Register Office
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}