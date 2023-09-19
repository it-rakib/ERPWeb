using System.Web.Mvc;

namespace ERP_WEB.Controllers.COMMERCIAL
{
    public class SalesContractController : Controller
    {
        readonly string prefixed = "../COMMERCIAL/ComSalesContract";
        // GET: StyleMaster
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/ContractSettings");
        }
    }
}