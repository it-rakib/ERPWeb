using AUtilities;
using DAL.Common;
using DBManager;
using DBManager.StoreProcedure;
using Entities.Core.NoticeSetting;
using Entities.Core.User;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;


namespace DAL.Core
{
    public class NoticeSettingDataService
    {
        SqlDataAdapter da;
        SqlConnection dbConn;
        SqlCommand cmd;
        DataTable dt;
        string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["SqlConnectionString"].ConnectionString;
        readonly CommonDataService _common = new CommonDataService();
        public List<NoticeInfo> GetNoticeData()
        {
            return _common.Select_Data_List<NoticeInfo>("SP_SELECT_NOTICE", "GET_NOTICE_DATA");
        }

        public GridEntity<NoticeInfo> GetNoticeSummary(GridOptions options)
        {
            return KendoGrid<NoticeInfo>.GetGridData(options, "SP_SELECT_NOTICE_GRID", "GET_NOTICE_INFO_DATA", "NOTICEID DESC");
        }

        public NoticeInfo SaveNoticeInfo(NoticeInfo objNotice, UserInfo user)
        {
            var lst = new NoticeInfo();
            try
            {
                DataTable dt =
                Insert_Update("SP_INSERT_NOTICEINFO", "SAVE_NOTICE_DATA", objNotice, user);
                lst = ListConversion.ConvertTo<NoticeInfo>(dt).SingleOrDefault();
                lst.SaveStatus = Operation.Success.ToString();

            }
            catch (Exception ex)
            {
                lst.SaveStatus = ex.Message;
            }
            return lst;
        }
        public DataTable Insert_Update(string procedure, string callname, NoticeInfo notice, UserInfo user)
        {
            dbConn = new SqlConnection(ConnectionString);
            dbConn.Open();

            cmd = new SqlCommand(procedure, dbConn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@call_name", callname));
            cmd.Parameters.Add(new SqlParameter("@p_NOTICEID", notice.NoticeId));
            cmd.Parameters.Add(new SqlParameter("@p_SUBJECT", notice.Subject));
            cmd.Parameters.Add(new SqlParameter("@p_DETAILS", notice.Details));
            if (notice.Date.ToString() == "01/01/01 12:00:00 AM")
            {
                cmd.Parameters.Add(new SqlParameter("@p_DATE", DBNull.Value));
            }
            else
            {
                cmd.Parameters.Add(new SqlParameter("@p_DATE", notice.Date));
            }
            cmd.Parameters.Add(new SqlParameter("@p_USERID", user.USERID));
            cmd.Parameters.Add(new SqlParameter("@p_TERMID", user.TermID));
            cmd.Parameters.Add(new SqlParameter("@p_ISACTV", "A"));

            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            da.Fill(dt);

            dbConn.Close();
            return dt;
        }
    }
}
