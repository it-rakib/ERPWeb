using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class VehicleRouteController : Controller
    {
        // GET: VehicleRoute
        readonly string prefixed = "../TRANSPORT/VehicleRoute";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}