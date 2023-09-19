using System.Web.Mvc;

namespace ERP_WEB.Controllers.LEGAL
{
    public class Update_DiaryController : Controller
    {
        // GET: Update_Diary
        readonly string prefixed = "../LEGAL/Update_Diary";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}