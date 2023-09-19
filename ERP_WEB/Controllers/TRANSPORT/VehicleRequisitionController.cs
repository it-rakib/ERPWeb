using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class VehicleRequisitionController : Controller
    {
        // GET: VehicleRequisition
        readonly string prefixed = "../TRANSPORT/VehicleRequisition";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}