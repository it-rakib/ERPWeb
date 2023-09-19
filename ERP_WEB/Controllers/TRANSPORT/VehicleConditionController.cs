using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class VehicleConditionController : Controller
    {
        // GET: VehicleCondition
        readonly string prefixed = "../TRANSPORT/VehicleCondition";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}