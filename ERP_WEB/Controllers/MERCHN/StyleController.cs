using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class StyleController : Controller
    {
        readonly string prefixed = "../MERCHN/Style";
        // GET: StyleMaster
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/StyleSettings");
        }
        public ActionResult StyleApprovedReject()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/StyleApprovedReject/StyleApprovedRejectSettings");
        }

        public ActionResult BuyerCosting()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View("../MERCHN/BuyerCosting/Index");
        }
        public ActionResult BuyerCostingAcknowledgement()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View("../MERCHN/BuyerCosting/BuyerCostingAcknowledgement/IndexAck");
        }

        public ActionResult BookingCosting()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View("../MERCHN/BookingCosting/Index");
        }

        public ActionResult GlobalSearch()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Search/SearchSettings");
        }
    }
}