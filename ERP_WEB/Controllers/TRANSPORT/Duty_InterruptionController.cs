using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class Duty_InterruptionController : Controller
    {
        // GET: Duty_Interruption
        readonly string prefixed = "../TRANSPORT/Duty_Interruption";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}