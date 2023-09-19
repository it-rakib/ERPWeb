using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class CmnBankBranchController : Controller
    {
        // GET: CmnBankBranch
        readonly string prefixed = "../MERCHN/CmnBankBranch";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}