using BLL.Core.User;
using BLL.HRM.AuditTrail;
using BLL.Login;
using DBManager;
using Entities.Core.User;
using System;
using System.Web.Mvc;


namespace ERP_WEB.Controllers
{
    public class HomeController : Controller
    {
        readonly ILoginRepository _loginRepository = new LoginService();
        readonly IUserRepository _userRepository = new UserService();
        private readonly IAuditTrailRepository _auditTrailRepository = new AuditTrailService();
        public ActionResult Index()
        {
            if (Session["CurrentUser"] != null)
            {
                return View();
            }
            return RedirectToAction("Logoff", "Home");
        }

        public ActionResult Project()
        {
            if (Session["CurrentUser"] != null)
            {
                return View();
            }
            return RedirectToAction("Logoff", "Home");
        }
        public ActionResult LogOff()
        {
            //session id for update logout time
            if (Session["SessionID"] != null)
            {
                string sessionId = Session["SessionID"].ToString();
                _loginRepository.LogOut(sessionId);
            }
            Session["CurrentUser"] = null;
            Session["SessionID"] = null;
            Session["PCName"] = null;


            //if ((int)this.HttpContext.Application["LiveSessionsCount"]> 0)
            //{
            //    this.HttpContext.Application.Lock();
            //    this.HttpContext.Application["LiveSessionsCount"] = ((int)this.HttpContext.Application["LiveSessionsCount"]) - 1;
            //    this.HttpContext.Application.UnLock();
            //}

            return View("Index");
        }
        public ActionResult Home()
        {
            if (Session["CurrentUser"] != null)
            {
                // int count = (int)this.HttpContext.Application["LiveSessionsCount"];
                return View();
            }
            return RedirectToAction("Logoff", "Home");
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            return View();
        }
        public ActionResult ChangePassword()
        {
            if (Session["CurrentUser"] != null)
            {
                return View();
               
            }
            else
            {
                Session["CurrentUser"] = null;
                return RedirectToAction("Logoff", "Home");
            }
        }
        public ActionResult SetPassword()
        {
            if (Session["CurrentUser"] != null)
            {
                return View();
            }
            else
            {
                Session["CurrentUser"] = null;
                return RedirectToAction("Logoff", "Home");
            }
        }
        public ActionResult ValidateUserLogin(string loginId, string password, string ipAddress)
        {

            // string UserPass = EncryptDecryptManager.Decrypt("", true);
            string res = "";
            string hostName = "Unknown1";
            if (Session["PCName"] != null)
            {
                hostName = Session["PCName"].ToString();
            }
            else
            {
                hostName = ipAddress;
                if (ipAddress == "" || ipAddress.Length > 16)
                {
                    hostName = Environment.MachineName;
                }
            }
            //session id for update logout time
            string sessionId = getRandom();
            var user = new UserInfo();
            try
            {
                user = _loginRepository.ValidateUserLogin(loginId, password, hostName, sessionId);
                if (user != null)
                {
                    user.TermID = hostName;
                    user.IpAddress = ipAddress;
                    Session["CurrentUser"] = user;
                    res = Operation.Success.ToString();
                    //save audit trail
                    _auditTrailRepository.SaveAudit(AuditTrail.GetAuditInfo("Login", "Login Into HRMIS Applicatoin", Request.CurrentExecutionFilePath, user));
                }
                else
                {
                    res = Operation.Failed.ToString();
                }
                if (user != null && user.IsSetPass == false)
                {
                    res = "CHANGE";
                    return Json(res, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);
            }
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        public string getRandom()
        {
            Guid id = Guid.NewGuid();
            Session["SessionID"] = id.ToString();
            return id.ToString();
        }
        public void GetHostName()
        {
            string remot_addr1 = Request.ServerVariables["REMOTE_ADDR"];
            string hostName = "Unknown1";
            string clientUserAddress = "Unknown2";
            try
            {
                if (!string.IsNullOrEmpty(remot_addr1))
                {
                    hostName = System.Net.Dns.GetHostEntry(remot_addr1).HostName;
                    if (!string.IsNullOrEmpty(hostName))
                        clientUserAddress = System.Net.Dns.GetHostAddresses(hostName).GetValue(0).ToString();
                }
                else
                {
                    hostName = Request.UserHostName.ToString();
                    clientUserAddress = Request.UserHostAddress.ToString();
                }
            }
            catch (Exception)
            {
                hostName = Request.UserHostName.ToString();
                clientUserAddress = Request.UserHostAddress.ToString();

            }
            string trueIP = "";
            //  Determine if the client is behind a proxy
            string ipBehindProxy = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            //  In case of multiple entry find the correct IP for the client
            if (!string.IsNullOrEmpty(ipBehindProxy))
            {
                string[] ipRange = ipBehindProxy.Split(',');
                trueIP = ipRange[0].Trim();
            }
            else
            {
                if (hostName != null) trueIP = hostName.ToUpper();
            }
            if (hostName != null) Session["PCName"] = hostName.ToUpper();
        }
        public ActionResult GetCurrentUser()
        {
            var user = (UserInfo)Session["CurrentUser"];
            var jsonResult = Json(user, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }
        public ActionResult SetModule(int moduleId = 0)
        {
            var user = new UserInfo();
            if (Session["CurrentUser"] != null)
            {
                user = (UserInfo)Session["CurrentUser"];
                user.ModuleId = moduleId;
                Session["CurrentUser"] = user;
                return Json(user, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return RedirectToAction("Logoff", "Home");
            }

        }
        public JsonResult GetUserList()
        {
            var res = _userRepository.GetUserList();

            var jsonResult = Json(res, JsonRequestBehavior.AllowGet);
            jsonResult.ContentType = "application/json";
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }
        public JsonResult GetUserListBySerachKey(string srcKey)
        {
            var res = _userRepository.GetUserList(srcKey);

            var jsonResult = Json(res, JsonRequestBehavior.AllowGet);
            jsonResult.ContentType = "application/json";
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }
        public ActionResult PasswordChange(string curpassword, string newpassword)
        {
            var user = (UserInfo)Session["CurrentUser"];
            var res = _userRepository.ChangePassword(curpassword, newpassword, user.EMPID, user.USERNAME, user);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
        public ActionResult SwitchLoginUser(string usrid)
        {
            var res = false;
            var user = _userRepository.GetUserInfoById(usrid);

            if (user != null)
            {
                Session["CurrentUser"] = user;
                res = true;
            }
            return Json(res, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ForgotPassword(PasswordResetInfo objForgotPass)
        {
            var res = _loginRepository.ForgotPassword(objForgotPass);
            return Json(res, JsonRequestBehavior.AllowGet);
        }
    }
    public static class Test
    {
        public static int Id { get; set; }
    }
}