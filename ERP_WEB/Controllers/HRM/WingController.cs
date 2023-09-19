using System.Collections.Generic;
using System.Web.Mvc;
using BLL.HRM.Wing;
using DBManager;
using Entities.HRM;

namespace ERP_WEB.Controllers.MERCHN
{
    public class WingController : Controller
    {
        readonly IWingRepository _wingRepository = new WingService();
        public ActionResult WingSettings()
        {
            if (Session["CurrentUser"] != null)
            {
                return View("../HRM/Wing/WingSettings");
            }
            else
            {
                return RedirectToAction("Logoff", "Home");
            }
        }

        public ActionResult SaveWing(Common_Wing objWing)
        {
            var res = _wingRepository.SaveWing(objWing);
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetWingSummary(GridOptions options)
        {
            var res = _wingRepository.GetWingSummary(options);
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAll(int unitId,int deptId, int secId)
        {
            var resuList = _wingRepository.GetAllWing(unitId, deptId, secId);
            return Json(resuList, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllMultiWing(CommonParams objParam)
        {
            var resuList = _wingRepository.GetAllMultiWing(objParam);
            return Json(resuList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDeptSectionSummary(GridOptions options)
        {
            var List = _wingRepository.GetDeptSectionSummary(options);
            return Json(List, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetWingPermissionSummary(GridOptions options, string DSecID)
        {
            var List = _wingRepository.GetWingPermissionSummary(options, DSecID);
            return Json(List, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SaveWingPermission(int DSecID, List<R_SecWing> objSecWingList, List<R_SecWing> objRemovedWingList)
        {
            var res = _wingRepository.SaveWingPermission(DSecID, objSecWingList, objRemovedWingList);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
    }
}