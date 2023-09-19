using BLL.Core.Menu;
using DBManager;
using Entities.Core.Menu;
using Entities.Core.User;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace ERP_WEB.Controllers
{
    public class MenuController : Controller
    {
        //
        // GET: /Menu/
        readonly IMenuRepository _menuRepository = new MenuService();
        public ActionResult MenuSettings()
        {
            if (Session["CurrentUser"] != null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Logoff", "Home");
            }
        }
        public ActionResult SaveMenu(Menu menu)
        {
            var res = "";
            UserInfo user = ((UserInfo)(Session["CurrentUser"]));

            var menuId = 0;
            try
            {
                var mn = menu.MenuName.Replace('^', '&');
                menu.MenuName = mn;
                menu.MenuPath = RemoveRightSlash(menu.MenuPath);
                res = _menuRepository.SaveMenu(menu);
            }
            catch (Exception exception)
            {
                res = exception.Message;
            }

            return Json(res, JsonRequestBehavior.AllowGet);
        }
        public ActionResult UpdateMenuSorting(List<Menu> menuList)
        {
            var res = "";
            UserInfo user = ((UserInfo)(Session["CurrentUser"]));
            try
            {
                res = _menuRepository.UpdateMenuSorting(menuList, user);

            }
            catch (Exception exception)
            {
                res = exception.Message;
            }
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        private string RemoveRightSlash(string menuPath)
        {
            var resMenuPath = menuPath;
            try
            {
                if (!string.IsNullOrEmpty(menuPath))
                {
                    var index = menuPath.Length - 1;
                    var path = (menuPath.LastIndexOf('/') == index) ? menuPath.Remove(index) : menuPath;
                    resMenuPath = (menuPath == path) ? path : RemoveRightSlash(path);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return resMenuPath;
        }
        public JsonResult GetMenuSummary(GridOptions options, string projId, string moduleId)
        {
            var menuList = _menuRepository.GetMenuSummary(options, projId, moduleId);
            return Json(menuList, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetMenuByModuleId(int moduleId)
        {
            List<Menu> menuList = _menuRepository.SelectAllMenuByModuleId(moduleId);
            return Json(menuList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SelectAllMenuForSorting(string projId, string moduleId)
        {
            List<Menu> menuList = _menuRepository.SelectAllMenu(projId, moduleId);
            var results = new
            {
                Items = menuList,
                TotalCount = 0
            };
            return Json(results);
        }
        public ActionResult SelectMenuByUserPermission(int nModuleId)
        {
            try
            {
                string userId = "";
                if (Session["CurrentUser"] != null)
                {
                    UserInfo user = ((UserInfo)(Session["CurrentUser"]));
                    userId = user.USERID;

                    List<Menu> menuList = _menuRepository.SelectMenuByUserPermission(userId, nModuleId);
                    return Json(menuList, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return RedirectToAction("Logoff", "Home");
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public ActionResult SaveAccessPermission(UserAccessPermission objAccess)
        {
            var user = (UserInfo)Session["CurrentUser"];
            objAccess.EntryUserId = user.USERID;
            objAccess.TerminalId = user.TermID;
            var res = _menuRepository.SaveAccessPermission(objAccess);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetMenuPermissionSummary(GridOptions options, string usrId, int projectId, int moduleId = 0)
        {
            //  User user = ((User)(Session["CurrentUser"]));

            var menuList = _menuRepository.GetMenuPermissionSummary(options, usrId, moduleId, projectId);
            return Json(menuList, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetReportPermissionSummary(GridOptions options, string usrId, int projectId, int menuId = 0)
        {
            //  User user = ((User)(Session["CurrentUser"]));
            var reportList = _menuRepository.GetReportPermissionSummary(options, usrId, menuId);
            return Json(reportList, JsonRequestBehavior.AllowGet);
        }

    }
}