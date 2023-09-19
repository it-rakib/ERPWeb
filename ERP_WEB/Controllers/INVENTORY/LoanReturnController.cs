using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.INVENTORY
{
    public class LoanReturnController : Controller
    {
        // GET: Loan Return
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View("../INVENTORY/LoanReturnInfo/Index");
        }
    }
}