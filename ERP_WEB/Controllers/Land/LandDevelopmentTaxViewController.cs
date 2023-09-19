using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class LandDevelopmentTaxViewController : Controller
    {
        // GET: LandDevelopmentTaxView
        readonly string prefixed = "../Land/LandDevelopmentTaxView";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}