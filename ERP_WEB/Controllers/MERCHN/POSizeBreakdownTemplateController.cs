using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class POSizeBreakdownTemplateController : Controller
    {
        readonly string prefixed = "../MERCHN/POSizeBreakdownTemplate";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}