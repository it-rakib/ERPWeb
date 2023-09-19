using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class VehicleInfoController : Controller
    {
        // GET: VehicleInfo
        readonly string prefixed = "../TRANSPORT/VehicleInfo";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}