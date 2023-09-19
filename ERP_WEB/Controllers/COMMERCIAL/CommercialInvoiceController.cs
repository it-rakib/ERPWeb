using System.Web.Mvc;

namespace ERP_WEB.Controllers.COMMERCIAL
{
    public class CommercialInvoiceController : Controller
    {
        readonly string prefixed = "../COMMERCIAL/ComInvoice";

        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/CommercialInvoiceSettings");
        }
    }
}