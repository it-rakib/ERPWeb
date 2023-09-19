using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class VehicleBrandController : Controller
    {
        // GET: VehicleBrand
        readonly string prefixed = "../TRANSPORT/VehicleBrand";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}