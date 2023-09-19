using AUtilities;
using DAL.Common;
using DBManager;
using Entities.Core.User;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace DAL.Login
{
    public class LoginDataService
    {
        SqlDataAdapter da;
        SqlConnection dbConn;
        SqlCommand cmd;
        DataSet ds;
        DataTable dt;
        string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["SqlConnectionStringHRM"].ConnectionString;
        string ConnectionString1 = System.Configuration.ConfigurationManager.ConnectionStrings["SqlConnectionString"].ConnectionString;
        readonly CommonDataServiceHRM _commonHRM = new CommonDataServiceHRM();
        readonly CommonDataService _common = new CommonDataService();
        public UserInfo GetUserById(string username, string userPass, string terminalId, string sessionId)
        {
            var ds = new DataSet();
            var dt = new DataTable();
            ds = _common.select_data_10("", "SP_LOGIN_USER", "LOGON_USER", username, userPass, terminalId, sessionId);

            dt = ds.Tables[0];

            var dataList = (List<UserInfo>)ListConversion.ConvertTo<UserInfo>(dt);
            return dataList.SingleOrDefault();
        }

        public void LogOut(string sessionId)
        {
            _common.select_data_10("", "SP_LOGIN_USER", "LOGOUT_USER", sessionId);
        }
        public PasswordResetInfo ForgotPassword(PasswordResetInfo objForgotPass)
        {
            var rv = "";
            var res = new PasswordResetInfo();
            try
            {
                var dt = ResetPassword("sp_ForgotPassword", "ForgotPassword", objForgotPass);
                res.Message = Operation.Success.ToString();
                res.EmpName = dt.Rows[0]["EmpName"].ToString();
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
            }
            return res;
        }

        public DataTable ResetPassword(string procedure, string callname, PasswordResetInfo objForgotPass)
        {
            dbConn = new SqlConnection(ConnectionString1);
            dbConn.Open();
            cmd = new SqlCommand(procedure, dbConn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.Add(new SqlParameter("@call_name", callname));
            cmd.Parameters.Add(new SqlParameter("@EmpCode", objForgotPass.EmpCode));
            cmd.Parameters.Add(new SqlParameter("@EmailOffice", objForgotPass.EmailOffice));
            cmd.Parameters.Add(new SqlParameter("@Password", objForgotPass.Password));
            cmd.Parameters.Add(new SqlParameter("@EncryptedPassword", objForgotPass.EncryptedPassword));
            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            da.Fill(dt);
            dbConn.Close();

            return dt;
        }
    }
}
