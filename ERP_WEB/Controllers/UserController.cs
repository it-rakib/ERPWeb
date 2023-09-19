using BLL.Core.User;
using DBManager;
using Entities.Core.Menu;
using Entities.Core.User;
using System.Collections.Generic;
using System.Web.Mvc;

namespace ERP_WEB.Controllers
{
    public class UserController : Controller
    {

        private static readonly IUserRepository _userRepository = new UserService();
        public ActionResult UserSettings()
        {

            if (Session["CurrentUser"] != null)
            {
                var pageurl = ".." + Request.CurrentExecutionFilePath;
                var user = (UserInfo)Session["CurrentUser"];
                if (!_userRepository.CheckUserMenuPermission(user.USERID, pageurl)) return RedirectToAction("AccessDenied", "User");
                return View();
            }
            else
            {
                return RedirectToAction("Logoff", "Home");
            }
        }

        public ActionResult AccessDenied()
        {
            return View("PageNotFound");
        }
        public JsonResult GetUserSummary(GridOptions options, string usrId)
        {
            var res = _userRepository.GetUserSummary(options, usrId);
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SaveUserPermission(MenuPermission usrObj, List<MenuPermission> objUserMenuList, List<MenuPermission> objRemovedMenuList, List<ReportPermission> objUserReportList, List<ReportPermission> objRemovedReportList)
        {
            var res = _userRepository.SaveUserPermission(usrObj, objUserMenuList, objRemovedMenuList, objUserReportList, objRemovedReportList);
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUserAccessPermission(string pathname)
        {
            var pageurl = pathname;
            var user = (UserInfo)Session["CurrentUser"];
            var res = _userRepository.GetUserAccessPermission(user.USERID, pageurl) ?? new UserAccessPermission();
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetUserAccessPermissionByUser(string pathname, string userId)
        {
            var pageurl = pathname;
            var res = _userRepository.GetUserAccessPermission(userId, pageurl) ?? new UserAccessPermission();
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetReportComboData(int menuId)
        {
            var user = (UserInfo)Session["CurrentUser"];
            var res = _userRepository.GetReportComboData(menuId, user.USERID);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
    }
}