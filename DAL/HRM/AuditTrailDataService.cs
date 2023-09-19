using Entities.HRM;
using System;
using System.Data;
using System.Data.SqlClient;

namespace DAL.HRM
{
    public class AuditTrailDataService
    {
        SqlDataAdapter da;
        SqlConnection dbConn;
        SqlCommand cmd;
        DataSet ds;
        DataTable dt;
        string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["SqlConnectionStringHRM"].ConnectionString;
        public void SaveAudit(AuditTrailEntity audit)
        {
            string rv = "";
            try
            {
                Insert_Update_AuditTrail("sp_Insert_Audit_Trail", "saveAuditTrailinfo", audit);
            }
            catch (Exception ex)
            {
                //throw new Exception(ex.Message);
            }

        }
        public DataTable Insert_Update_AuditTrail(string procedure, string callname, AuditTrailEntity audit)
        {
            dbConn = new SqlConnection(ConnectionString);
            dbConn.Open();
            cmd = new SqlCommand(procedure, dbConn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(new SqlParameter("@call_name", callname));
            cmd.Parameters.Add(new SqlParameter("@p_AuditDate", audit.AuditDate));
            cmd.Parameters.Add(new SqlParameter("@p_AuditTask", audit.AuditTask));
            cmd.Parameters.Add(new SqlParameter("@p_TaskType", audit.TaskType));
            cmd.Parameters.Add(new SqlParameter("@p_AuditDesc", audit.AuditDesc));
            cmd.Parameters.Add(new SqlParameter("@p_PageUrl", audit.PageUrl));
            cmd.Parameters.Add(new SqlParameter("@p_UserId", audit.UserId));
            cmd.Parameters.Add(new SqlParameter("@p_AuditedEmpId", audit.AuditedEmpId));
            cmd.Parameters.Add(new SqlParameter("@p_EmpIds", audit.EmpIds));
            cmd.Parameters.Add(new SqlParameter("@p_DateFrom", audit.DateFrom));
            cmd.Parameters.Add(new SqlParameter("@p_DateTo", audit.DateTo));
            cmd.Parameters.Add(new SqlParameter("@p_IPAddress", audit.IPAddress));
            cmd.Parameters.Add(new SqlParameter("@p_MacAddress", audit.MacAddress));
            cmd.Parameters.Add(new SqlParameter("@p_TerminalId", audit.TerminalId));
            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            da.Fill(dt);
            dbConn.Close();
            dbConn.Dispose();
            return dt;
        }
    }
}
