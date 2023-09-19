using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.INVENTORY
{
    public class SampleRequisitionController : Controller
    {
        // GET: Sample Requisition
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View("../Inventory/SampleRequisition/Index");
        }
    }
}