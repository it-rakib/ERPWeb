using BLL.HRM.Common;
using Entities.Core.User;
using Entities.HRM.DTO;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.HRM
{

    public class CommonController : Controller
    {
        ICommonRepository _commonRepository = new CommonService();

        public JsonResult GetAllPaymentMode()
        {
            var res = _commonRepository.GetAllPaymentMode();
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllCurrency()
        {
            var res = _commonRepository.GetAllCurrency();
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public JsonpResult GetAllDepartment()
        {
            var res = _commonRepository.GetAllDepartment();
            return (JsonpResult)Json(res, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllBank()
        {
            var res = _commonRepository.GetAllBank();
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllBranchByBank(int bankId)
        {
            var res = _commonRepository.GetAllBranchByBank(bankId);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllSalaryPayCompany()
        {
            var res = _commonRepository.GetAllSalaryPayCompany();
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllFormula()
        {
            var res = _commonRepository.GetAllFormula();
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllIncrementType()
        {
            var res = _commonRepository.GetAllIncrementType();
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllUserLevel()
        {
            var user = (UserInfo)Session["CurrentUser"];
            var res = _commonRepository.GetAllUserLevel(user.EMPID);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAllProjectList()
        {
            var res = _commonRepository.GetAllProjectList();
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllDistrict()
        {
            var res = _commonRepository.GetAllDistrict();
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAllUnit()
        {
            var res = _commonRepository.GetAllUnit();
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        //public JsonResult GetAllDepartment()
        //{
        //    var res = _commonRepository.GetAllDepartment();
        //    return Json(res, JsonRequestBehavior.AllowGet);
        //}

        public JsonResult GetHRMMode(int unitId)
        {
            var user = (UserInfo)Session["CurrentUser"];

            if (unitId == 0)
            {
                unitId = user.UNITID;
            }
            var res = _commonRepository.GetHRMMode(unitId);
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SaveHRMMode(HRMMode objHrmMode)
        {
            var user = (UserInfo)Session["CurrentUser"];
            objHrmMode.UserId = user.USERID;
            var res = _commonRepository.SaveHRMMode(objHrmMode);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
    }
}