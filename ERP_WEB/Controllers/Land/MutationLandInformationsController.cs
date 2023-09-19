using BLL.LAND.LandInformations;
using BLL.LAND.MutationLandInformations;
using DBManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.Land
{
    public class MutationLandInformationsController : Controller
    {
        readonly IMutationLandInformationsRepository _mutationLandInformationsRepository = new MutationLandInformationsService();
        // GET: LandInformations

        readonly string prefixed = "../Land/MutationLandInformations";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }

        public JsonResult GetMutationLandInformationsSummary(GridOptions options)
        {
            var res = _mutationLandInformationsRepository.GetMutationLandInformationsSummary(options);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
    }
}