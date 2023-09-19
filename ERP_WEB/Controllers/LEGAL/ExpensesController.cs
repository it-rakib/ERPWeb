using System.Web.Mvc;

namespace ERP_WEB.Controllers.LEGAL
{
    public class ExpensesController : Controller
    {
        // GET: Expenses
        readonly string prefixed = "../LEGAL/Expenses";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}