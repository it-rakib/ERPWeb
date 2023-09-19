using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.INVENTORY
{
    public class ConsignmentController : Controller
    {
        // GET: Consignment 
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View("../Inventory/ConsignmentInfo/Index");
        }

        public ActionResult Accknowledgement()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View("../Inventory/ConsignmentRcvInfo/Accknowledgement");
        }
    }
}