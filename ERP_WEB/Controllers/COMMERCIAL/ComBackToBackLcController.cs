using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.COMMERCIAL
{
    public class ComBackToBackLcController : Controller
    {
        // GET: COMBackToBackLC
        private readonly string _prefixed = "../COMMERCIAL/ComBackToBackLc";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(_prefixed + "/BackToBackSettings");
        }

        
    }
}