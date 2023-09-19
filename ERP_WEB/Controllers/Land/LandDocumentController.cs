using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class LandDocumentController : Controller
    {
        // GET: LandDocument
        readonly string prefixed = "../Land/LandDocuments";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/_LandDocumentsSettings");
        }
    }
}