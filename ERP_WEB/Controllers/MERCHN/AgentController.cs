using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class AgentController : Controller
    {
        // GET: Agent
        readonly string prefixed = "../MERCHN/Agent";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}