using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class InsuranceController : Controller
    {
        // GET: Insurance
        readonly string prefixed = "../TRANSPORT/Insurance";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}