using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class Vehicle_AllocationController : Controller
    {
        // GET: Vehicle_Allocation
        readonly string prefixed = "../TRANSPORT/Vehicle_Allocation";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}