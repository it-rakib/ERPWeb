using AUtilities;
using DAL.Core;
using DBManager;
using Entities.Core.Menu;
using Entities.Core.User;
using System;
using System.Collections.Generic;
using System.Data;
using System.Security.Cryptography;
using System.Text;


namespace BLL.Core.User
{
    public class UserService : IUserRepository
    {
        readonly UserDataService _userDataService = new UserDataService();
        public List<UserInfo> GetUserList()
        {
            return _userDataService.GetUserList();
        }

        public GridEntity<UserInfo> GetUserSummary(GridOptions options, string usrId)
        {
            var res = _userDataService.GetUserSummary(options, usrId);
            foreach (var obj in res.Items)
            {
                obj.USRPASS = EncryptDecryptManager.Decrypt(obj.USRPASS, true);
            }
            return res;
        }

        public string SaveUserPermission(MenuPermission usrObj, List<MenuPermission> objUserMenuList, List<MenuPermission> objRemovedMenuList, List<ReportPermission> objUserReportList, List<ReportPermission> objRemovedReportList)
        {
            var usrMenu_dt = new DataTable();
            usrMenu_dt.Columns.Add("MENUPERMISSIONID");
            usrMenu_dt.Columns.Add("USERID");
            usrMenu_dt.Columns.Add("MENUID");

            if (objUserMenuList != null)
                foreach (var objMenu in objUserMenuList)
                {
                    DataRow row1;
                    row1 = usrMenu_dt.NewRow();
                    row1["MENUPERMISSIONID"] = objMenu.MenuPermissionId;
                    row1["USERID"] = usrObj.UserId;
                    row1["MENUID"] = objMenu.MenuId;
                    usrMenu_dt.Rows.Add(row1);
                }
            usrMenu_dt.TableName = "tblmenu";
            DataSet dsMenu = new DataSet("dsMenu");
            dsMenu.Tables.Add(usrMenu_dt);

            //RemoveMenu
            var removeMenu_dt = new DataTable();
            removeMenu_dt.Columns.Add("MENUPERMISSIONID");
            removeMenu_dt.Columns.Add("USERID");
            removeMenu_dt.Columns.Add("MENUID");
            if (objRemovedMenuList != null)
                foreach (var objMenu in objRemovedMenuList)
                {
                    DataRow row1;
                    row1 = removeMenu_dt.NewRow();
                    row1["MENUPERMISSIONID"] = objMenu.MenuPermissionId;
                    row1["USERID"] = usrObj.UserId;
                    row1["MENUID"] = objMenu.MenuId;
                    removeMenu_dt.Rows.Add(row1);
                }
            removeMenu_dt.TableName = "tblRemoveMenu";
            DataSet dsRemoveMenu = new DataSet("dsRemoveMenu");
            dsRemoveMenu.Tables.Add(removeMenu_dt);

            //---------------------
            var usrReport_dt = new DataTable();
            usrReport_dt.Columns.Add("REPORTPERMISSIONID");
            usrReport_dt.Columns.Add("USERID");
            usrReport_dt.Columns.Add("REPORTID");

            if (objUserReportList != null)
                foreach (var objReport in objUserReportList)
                {
                    DataRow row1;
                    row1 = usrReport_dt.NewRow();
                    row1["REPORTPERMISSIONID"] = objReport.ReportPermissionId;
                    row1["USERID"] = usrObj.UserId;
                    row1["REPORTID"] = objReport.ReportId;
                    usrReport_dt.Rows.Add(row1);
                }
            usrReport_dt.TableName = "tblReport";
            DataSet dsReport = new DataSet("dsReport");
            dsReport.Tables.Add(usrReport_dt);

            //RemoveReport
            var removeReport_dt = new DataTable();
            removeReport_dt.Columns.Add("REPORTPERMISSIONID");
            removeReport_dt.Columns.Add("USERID");
            removeReport_dt.Columns.Add("REPORTID");
            if (objRemovedReportList != null)
                foreach (var objReport in objRemovedReportList)
                {
                    DataRow row1;
                    row1 = removeReport_dt.NewRow();
                    row1["REPORTPERMISSIONID"] = objReport.ReportPermissionId;
                    row1["USERID"] = usrObj.UserId;
                    row1["REPORTID"] = objReport.ReportId;
                    removeReport_dt.Rows.Add(row1);
                }
            removeReport_dt.TableName = "tblRemoveReport";
            DataSet dsRemoveReport = new DataSet("dsRemoveReport");
            dsRemoveReport.Tables.Add(removeReport_dt);

            usrObj.UsrPass = EncryptDecryptManager.Encrypt(usrObj.UsrPass, true);

            return _userDataService.SaveUserPermission(usrObj, dsMenu, dsRemoveMenu, dsReport, dsRemoveReport);
        }

        public string ChangePassword(string curpassword, string newpassword, string usrid, string username, UserInfo user)
        {
            //string UserNameR = StrReverse(usrid);
            //string Curr_userpass = EncodeMD5(UserNameR + curpassword.Trim());
            //string New_UserPass = EncodeMD5(UserNameR + newpassword);
            string Curr_userpass = EncryptDecryptManager.Encrypt(curpassword, true);
            string New_UserPass = EncryptDecryptManager.Encrypt(newpassword, true);
            return _userDataService.ChangePasswordNew(usrid, Curr_userpass, New_UserPass, user);
        }

        public UserInfo GetUserInfoById(string usrid)
        {
            return _userDataService.GetUserInfoById(usrid);
        }

        public bool CheckUserMenuPermission(string userid, string pageurl)
        {
            return _userDataService.CheckUserMenuPermission(userid, pageurl);
        }

        public UserAccessPermission GetUserAccessPermission(string userid, string pageurl)
        {
            return _userDataService.GetUserAccessPermission(userid, pageurl);
        }

        public static string EncodeMD5(string originalStr)
        {
            Byte[] originalBytes;
            Byte[] encodedBytes;
            MD5 md5 = new MD5CryptoServiceProvider();
            originalBytes = ASCIIEncoding.Default.GetBytes(originalStr);
            encodedBytes = md5.ComputeHash(originalBytes);
            return BitConverter.ToString(encodedBytes);
        }

        public static string StrReverse(string s)
        {
            char[] arr = s.ToCharArray();
            Array.Reverse(arr);
            return new string(arr);
        }

        public List<ReportPermission> GetReportComboData(int menuId, string userid)
        {
            return _userDataService.GetReportComboData(menuId, userid);
        }

        public List<UserInfo> GetUserList(string srcKey)
        {
            return _userDataService.GetUserList(srcKey);
        }
    }
}
