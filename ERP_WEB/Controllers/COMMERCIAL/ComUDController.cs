using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.COMMERCIAL
{
    public class ComUDController : Controller
    {
        // GET: ComUD
        private readonly string _prefixed = "../COMMERCIAL/ComUDInfo";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(_prefixed + "/UDSettings");
        }
    }
}