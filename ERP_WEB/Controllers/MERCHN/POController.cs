using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class POController : Controller
    {
        // GET: PO
        public ActionResult POInfo()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View("../MERCHN/POInfo/POInfoSettings");
        }
        public ActionResult POAcknowledgement()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View("../MERCHN/POInfo/POAcknowledgement/POAcknowledgementSettings");
        }
        public ActionResult POUsingFileUpload()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View("../MERCHN/POInfo/POUsingFileUpload/Index");
        }

    }
}