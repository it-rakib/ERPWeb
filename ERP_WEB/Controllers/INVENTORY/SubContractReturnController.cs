using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.INVENTORY
{
    public class SubContractReturnController : Controller
    {
        // GET: Sub Contract Return
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View("../INVENTORY/SubContractReturnInfo/Index");
        }
    }
}