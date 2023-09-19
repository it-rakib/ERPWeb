using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class InsuranceCompanyController : Controller
    {
        // GET: InsuranceCompany
        readonly string prefixed = "../TRANSPORT/InsuranceCompany";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}