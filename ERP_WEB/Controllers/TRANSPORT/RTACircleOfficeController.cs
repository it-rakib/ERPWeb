using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class RTACircleOfficeController : Controller
    {
        // GET: RTACircleOffice
        readonly string prefixed = "../TRANSPORT/RTACircleOffice";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}