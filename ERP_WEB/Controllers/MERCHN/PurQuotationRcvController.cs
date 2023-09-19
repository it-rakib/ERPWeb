using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class PurQuotationRcvController : Controller
    {
        readonly string prefixed = "../MERCHN/PurQuotationRcv";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/PurQuotationRcvSettings");
        }
    }
}
