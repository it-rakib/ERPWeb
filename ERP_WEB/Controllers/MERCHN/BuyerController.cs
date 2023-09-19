using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class BuyerController : Controller
    {
        // GET: Buyer
        readonly string prefixed = "../MERCHN/Buyer";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}