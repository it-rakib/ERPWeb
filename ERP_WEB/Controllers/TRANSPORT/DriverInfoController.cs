using BLL.HRM.Common;
using Entities.Core.User;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.TRANSPORT
{
    public class DriverInfoController : Controller
    {
        ICommonRepository _commonRepository = new CommonService();
        // GET: DriverInfo
        readonly string prefixed = "../TRANSPORT/DriverInfo";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }

        public JsonResult GetAllEmployee()//By User Permission
        {
            var user = (UserInfo)Session["CurrentUser"];
            var res = _commonRepository.GetAllEmployee(user.COMPANYID.ToString());
            return Json(res, JsonRequestBehavior.AllowGet);
        }
    }
}