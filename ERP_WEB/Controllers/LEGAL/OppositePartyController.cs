using System.Web.Mvc;

namespace ERP_WEB.Controllers.LEGAL
{
    public class OppositePartyController : Controller
    {
        // GET: OppositeParty
        readonly string prefixed = "../LEGAL/OppositeParty";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}