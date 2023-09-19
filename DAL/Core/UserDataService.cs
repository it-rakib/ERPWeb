using DAL.Common;
using DBManager;
using DBManager.StoreProcedure;
using Entities.Core.Menu;
using Entities.Core.User;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;


namespace DAL.Core
{
    public class UserDataService
    {
        SqlDataAdapter da;
        SqlConnection dbConn;
        SqlCommand cmd;
        DataSet ds;
        DataTable dt;
        string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["SqlConnectionString"].ConnectionString;
        readonly CommonDataService _common = new CommonDataService();
        public List<UserInfo> GetUserList()
        {
            return _common.Select_Data_List<UserInfo>("SP_LOGIN_USER", "GET_USER_LIST");
        }

        public GridEntity<UserInfo> GetUserSummary(GridOptions options, string usrId)
        {
            return KendoGrid<UserInfo>.GetGridData(options, "SP_SELECT_USER_GRID", "GET_USER_DATA", "USERNAME", 0, usrId);
        }

        public string SaveUserPermission(MenuPermission usrObj, DataSet dsMenu, DataSet dsRemoveMenu, DataSet dsReport, DataSet dsRemoveReport)
        {
            string rv = "";
            try
            {
                Insert_Update("SP_INSERT_USER", "SAVE_USER_MENU_PERMISSION_DATA", usrObj, dsMenu, dsRemoveMenu, dsReport, dsRemoveReport);

                rv = Operation.Success.ToString();
            }
            catch (Exception ex)
            {
                rv = ex.Message;
            }
            return rv;
        }
        public DataTable Insert_Update(string procedure, string callname, MenuPermission menu, DataSet rqdXmlv1 = null, DataSet rqdXmlv2 = null, DataSet rqdXmlv3 = null, DataSet rqdXmlv4 = null)
        {
            dbConn = new SqlConnection(ConnectionString);
            dbConn.Open();

            cmd = new SqlCommand(procedure, dbConn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@dsxmlu1", SqlDbType.Xml).Value = (rqdXmlv1 == null ? null : rqdXmlv1.GetXml());
            cmd.Parameters.Add("@dsxmlu2", SqlDbType.Xml).Value = (rqdXmlv2 == null ? null : rqdXmlv2.GetXml());
            cmd.Parameters.Add("@dsxmlu3", SqlDbType.Xml).Value = (rqdXmlv3 == null ? null : rqdXmlv3.GetXml());
            cmd.Parameters.Add("@dsxmlu4", SqlDbType.Xml).Value = (rqdXmlv4 == null ? null : rqdXmlv4.GetXml());
            cmd.Parameters.Add(new SqlParameter("@call_name", callname));
            cmd.Parameters.Add(new SqlParameter("@p_USERID", menu.UserId));
            cmd.Parameters.Add(new SqlParameter("@p_EMPID", menu.EmpId));
            cmd.Parameters.Add(new SqlParameter("@p_USERNAME", menu.UserName));
            cmd.Parameters.Add(new SqlParameter("@p_USERDESIG", menu.UsrDesig));
            cmd.Parameters.Add(new SqlParameter("@p_USERPASS", menu.UsrPass));
            cmd.Parameters.Add(new SqlParameter("@p_USERRIGHT", menu.UsrRight));
            cmd.Parameters.Add(new SqlParameter("@p_USERTYPE", menu.UserType));
            cmd.Parameters.Add(new SqlParameter("@p_USERLEVEL", menu.UserLevel));

            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            da.Fill(dt);

            dbConn.Close();
            return dt;
        }

        public string ChangePassword(string username, string currUserpass, string newUserPass, UserInfo user)
        {
            string rv = "";

            try
            {
                CommonConnection con = new CommonConnection();
                string sql = String.Format(@"UPDATE UserInfo SET USRPASS='{0}',ISSETPASS=1  WHERE EMPID = '{1}' AND USRPASS='{2}'", newUserPass, username, currUserpass);
                con.ExecuteNonQuery(sql);
                rv = Operation.Success.ToString();
                return rv;
            }
            catch (Exception)
            {
                rv = Operation.Failed.ToString();
            }

            return rv;
        }
        public string ChangePasswordNew(string username, string currUserpass, string newUserPass, UserInfo user)
        {
            string rv = "";
            try
            {
                Change_Password("sp_change_password", "change_password", currUserpass, newUserPass, user);
                rv = Operation.Success.ToString();
            }
            catch (Exception ex)
            {
                rv = ex.Message;
            }
            return rv;
        }
        public DataTable Change_Password(string procedure, string callname, string currUserpass, string newUserPass, UserInfo user)
        {
            dbConn = new SqlConnection(ConnectionString);
            dbConn.Open();
            cmd = new SqlCommand(procedure, dbConn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(new SqlParameter("@call_name", callname));
            cmd.Parameters.Add(new SqlParameter("@p_USERID", user.USERID));
            cmd.Parameters.Add(new SqlParameter("@p_EMPID", user.EMPID));
            cmd.Parameters.Add(new SqlParameter("@p_USERCURPASS", currUserpass));
            cmd.Parameters.Add(new SqlParameter("@p_USERNEWPASS", newUserPass));
            cmd.Parameters.Add(new SqlParameter("@p_USERTYPE", user.USERTYPE));
            cmd.Parameters.Add(new SqlParameter("@p_USERLEVEL", user.USERLEVELID));
            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            da.Fill(dt);
            dbConn.Close();
            return dt;
        }

        public UserInfo GetUserInfoById(string usrid)
        {
            CommonDataService common = new CommonDataService();
            var usrList = common.Select_Data_List<UserInfo>("SP_LOGIN_USER", "GET_USER_BY_ID", usrid);
            return usrList.SingleOrDefault();
        }

        public bool CheckUserMenuPermission(string userid, string pageurl)
        {
            CommonDataService common = new CommonDataService();
            var usrList = common.Select_Data_List<MenuPermission>("sp_select_menu", "get_user_page_permission", userid, pageurl);
            if (usrList != null && usrList.Count > 0) return true;
            return false;
        }

        public UserAccessPermission GetUserAccessPermission(string userid, string pageurl)
        {
            CommonDataService common = new CommonDataService();
            var accessPermission = common.Select_Data_List<UserAccessPermission>("sp_select_menu", "get_user_access_permission", userid, pageurl).SingleOrDefault();
            return accessPermission;
        }

        public List<ReportPermission> GetReportComboData(int menuId, string userid)
        {
            CommonDataService common = new CommonDataService();
            var reportList = common.Select_Data_List<ReportPermission>("sp_select_menu", "get_user_report_permission", menuId.ToString(), userid);
            return reportList;
        }

        public List<UserInfo> GetUserList(string srcKey)
        {
            string searchKey = srcKey == "" ? "%" : srcKey;
            return _common.Select_Data_List<UserInfo>("SP_LOGIN_USER", "GET_USER_LIST", searchKey);
        }
    }
}
