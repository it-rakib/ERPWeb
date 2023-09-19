using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class BookingController : Controller
    {
        // GET: Booking
        public ActionResult BookingFabric()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View("../MERCHN/BookingFabric/BookingFabricSettings");
        }
        public ActionResult BookingAccessories()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View("../MERCHN/BookingAccessories/BookingAccessoriesSettings");
        }
    }
}