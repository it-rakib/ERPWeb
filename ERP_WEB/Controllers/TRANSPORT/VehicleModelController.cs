using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class VehicleModelController : Controller
    {
        // GET: VehicleModel
        readonly string prefixed = "../TRANSPORT/VehicleModel";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}