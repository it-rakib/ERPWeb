using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class VehicleRequisitionApprovalController : Controller
    {
        // GET: VehicleRequisitionApproval
        readonly string prefixed = "../TRANSPORT/VehicleRequisitionApproval";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}