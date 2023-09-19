using BLL.LAND.LandInformations;
using DBManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class LandInformationsController : Controller
    {
        readonly ILandInformationsRepository _landInformationsRepository = new LandInformationsService();
        // GET: LandInformations

        readonly string prefixed = "../Land/LandInformations";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }

        public JsonResult GetLandInformationSummary(GridOptions options)
        {
            var res = _landInformationsRepository.GetLandInformationsSummary(options);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
    }
}