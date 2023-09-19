using BLL.Core.Module;
using Entities.Core.Module;
using Entities.Core.User;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace ERP_WEB.Controllers
{
    public class ModuleController : Controller
    {
        //
        // GET: /Module/
        readonly IModuleRepository _moduleRepository = new ModuleService();
        //public ActionResult Module()
        //{
        //    if (Session["CurrentUser"] != null)
        //    {
        //        return View("../Home/Module");
        //    }
        //    else
        //    {
        //        return RedirectToAction("Logoff", "Home");
        //    }
        //}

        public JsonResult SelectModule(int projectId)
        {
            List<ModuleInfo> moduleList = _moduleRepository.SelectAllModule(projectId);
            return Json(moduleList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SelectModuleByUserPermission(int projectId)
        {
            try
            {
                string userId = "";
                if (Session["CurrentUser"] != null)
                {
                    UserInfo user = ((UserInfo)(Session["CurrentUser"]));
                    userId = user.USERID;

                    List<ModuleInfo> moduleList = _moduleRepository.SelectModuleByUserPermission(userId, projectId);
                    return Json(moduleList, JsonRequestBehavior.AllowGet);
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
    }
}