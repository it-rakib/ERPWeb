using System.Web.Mvc;

namespace ERP_WEB.Controllers
{
    public class DashboardController : Controller
    {
        public ActionResult Dashboard()
        {
            if (Session["CurrentUser"] != null)
            {
                return View("../Dashboard/Dashboard");
            }
            else
            {
                return RedirectToAction("Logoff", "Home");
            }
        }
    }
}