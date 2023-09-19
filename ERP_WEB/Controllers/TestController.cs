using System.Web.Mvc;

namespace ERP_WEB.Controllers
{
    public class TestController : Controller
    {
        // GET: Test
        public ActionResult Test()
        {
            return View();
        }

        public JsonResult FilterData(string text)
        {
            return Json("", JsonRequestBehavior.AllowGet);
        }
    }
}