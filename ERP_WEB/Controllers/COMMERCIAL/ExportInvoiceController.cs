using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.COMMERCIAL
{
    public class ExportInvoiceController : Controller
    {
        readonly string prefixed = "../COMMERCIAL/ExportInvoice";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}