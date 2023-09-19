using AUtilities;
using Entities.HRM;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace DAL.Common
{
    public class CommonDataServiceLand
    {
        SqlDataAdapter da;
        SqlConnection dbConn;
        SqlCommand cmd;
        DataSet ds;
        DataTable dt;
        string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["LANDDBConnectionString"].ConnectionString;
        public DataSet select_data_10(string comCostID, string ProcName, string CallType, string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "", string parm9 = "", string parm10 = "")
        {
            try
            {
                dbConn = new SqlConnection(ConnectionString);
                dbConn.Open();

                cmd = new SqlCommand(ProcName, dbConn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@ComC1", comCostID));
                cmd.Parameters.Add(new SqlParameter("@CallType", CallType));
                cmd.Parameters.Add(new SqlParameter("@Desc1", parm1));
                cmd.Parameters.Add(new SqlParameter("@Desc2", parm2));
                cmd.Parameters.Add(new SqlParameter("@Desc3", parm3));
                cmd.Parameters.Add(new SqlParameter("@Desc4", parm4));
                cmd.Parameters.Add(new SqlParameter("@Desc5", parm5));
                cmd.Parameters.Add(new SqlParameter("@Desc6", parm6));
                cmd.Parameters.Add(new SqlParameter("@Desc7", parm7));
                cmd.Parameters.Add(new SqlParameter("@Desc8", parm8));
                cmd.Parameters.Add(new SqlParameter("@Desc9", parm9));
                cmd.Parameters.Add(new SqlParameter("@Desc10", parm10));

                da = new SqlDataAdapter(cmd);
                ds = new DataSet();
                da.Fill(ds);
                dbConn.Close();

                return ds;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public List<T> Select_Data_List<T>(string procedureName, string callName, string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "", string parm9 = "", string parm10 = "")
        {
            try
            {
                dbConn = new SqlConnection(ConnectionString);
                dbConn.Open();

                cmd = new SqlCommand(procedureName, dbConn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@CallType", callName));
                cmd.Parameters.Add(new SqlParameter("@Desc1", parm1));
                cmd.Parameters.Add(new SqlParameter("@Desc2", parm2));
                cmd.Parameters.Add(new SqlParameter("@Desc3", parm3));
                cmd.Parameters.Add(new SqlParameter("@Desc4", parm4));
                cmd.Parameters.Add(new SqlParameter("@Desc5", parm5));
                cmd.Parameters.Add(new SqlParameter("@Desc6", parm6));
                cmd.Parameters.Add(new SqlParameter("@Desc7", parm7));
                cmd.Parameters.Add(new SqlParameter("@Desc8", parm8));
                cmd.Parameters.Add(new SqlParameter("@Desc9", parm9));
                cmd.Parameters.Add(new SqlParameter("@Desc10", parm10));

                da = new SqlDataAdapter(cmd);
                ds = new DataSet();
                da.Fill(ds);
                dbConn.Close();

                dt = ds.Tables[0];
                var dataList = new List<T>();

                if (dt.Rows.Count > 0)
                {
                    dataList = (List<T>)ListConversion.ConvertTo<T>(dt);
                }

                return dataList;
            }
            catch (Exception)
            {
                return null;
            }
        }
        public List<T> Select_Generic_Data_List<T>(string procedureName, string callName, string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "", string parm9 = "", string parm10 = "")
        {
            try
            {
                dbConn = new SqlConnection(ConnectionString);
                dbConn.Open();

                cmd = new SqlCommand(procedureName, dbConn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@CallType", callName));
                cmd.Parameters.Add(new SqlParameter("@Desc1", parm1));
                cmd.Parameters.Add(new SqlParameter("@Desc2", parm2));
                cmd.Parameters.Add(new SqlParameter("@Desc3", parm3));
                cmd.Parameters.Add(new SqlParameter("@Desc4", parm4));
                cmd.Parameters.Add(new SqlParameter("@Desc5", parm5));
                cmd.Parameters.Add(new SqlParameter("@Desc6", parm6));
                cmd.Parameters.Add(new SqlParameter("@Desc7", parm7));
                cmd.Parameters.Add(new SqlParameter("@Desc8", parm8));
                cmd.Parameters.Add(new SqlParameter("@Desc9", parm9));
                cmd.Parameters.Add(new SqlParameter("@Desc10", parm10));

                da = new SqlDataAdapter(cmd);
                ds = new DataSet();
                da.Fill(ds);
                dbConn.Close();

                dt = ds.Tables[0];
                var dataList = new List<T>();

                if (dt.Rows.Count > 0)
                {
                    dataList = (List<T>)GenericListGenerator.GetList<T>(dt);
                }

                return dataList;
            }
            catch
            {
                return null;
            }
        }

        public T Select_Data_Object<T>(string procedureName, string callName, string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "", string parm9 = "", string parm10 = "")
        {
            try
            {
                dbConn = new SqlConnection(ConnectionString);
                dbConn.Open();

                cmd = new SqlCommand(procedureName, dbConn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@CallType", callName));
                cmd.Parameters.Add(new SqlParameter("@Desc1", parm1));
                cmd.Parameters.Add(new SqlParameter("@Desc2", parm2));
                cmd.Parameters.Add(new SqlParameter("@Desc3", parm3));
                cmd.Parameters.Add(new SqlParameter("@Desc4", parm4));
                cmd.Parameters.Add(new SqlParameter("@Desc5", parm5));
                cmd.Parameters.Add(new SqlParameter("@Desc6", parm6));
                cmd.Parameters.Add(new SqlParameter("@Desc7", parm7));
                cmd.Parameters.Add(new SqlParameter("@Desc8", parm8));
                cmd.Parameters.Add(new SqlParameter("@Desc9", parm9));
                cmd.Parameters.Add(new SqlParameter("@Desc10", parm10));

                da = new SqlDataAdapter(cmd);
                ds = new DataSet();
                da.Fill(ds);
                dbConn.Close();

                dt = ds.Tables[0];
                var dataList = new List<T>();

                if (dt.Rows.Count > 0)
                {
                    dataList = (List<T>)ListConversion.ConvertTo<T>(dt);
                }

                return dataList.SingleOrDefault();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public DataSet GetDataSet(String sql)
        {
            try
            {
                ds = new DataSet();
                dbConn = new SqlConnection(ConnectionString);
                dbConn.Open();
                SqlDataAdapter da = new SqlDataAdapter(sql, dbConn);
                da.Fill(ds);
                dbConn.Close();
                return ds;
            }
            catch (Exception)
            {
                throw new Exception();
            }

        }

        public DataTable select_data_dt_10(string comCostID, string ProcName, string CallType, string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "", string parm9 = "", string parm10 = "")
        {
            try
            {
                dbConn = new SqlConnection(ConnectionString);
                dbConn.Open();

                cmd = new SqlCommand(ProcName, dbConn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@ComC1", comCostID));
                cmd.Parameters.Add(new SqlParameter("@CallType", CallType));
                cmd.Parameters.Add(new SqlParameter("@Desc1", parm1));
                cmd.Parameters.Add(new SqlParameter("@Desc2", parm2));
                cmd.Parameters.Add(new SqlParameter("@Desc3", parm3));
                cmd.Parameters.Add(new SqlParameter("@Desc4", parm4));
                cmd.Parameters.Add(new SqlParameter("@Desc5", parm5));
                cmd.Parameters.Add(new SqlParameter("@Desc6", parm6));
                cmd.Parameters.Add(new SqlParameter("@Desc7", parm7));
                cmd.Parameters.Add(new SqlParameter("@Desc8", parm8));
                cmd.Parameters.Add(new SqlParameter("@Desc9", parm9));
                cmd.Parameters.Add(new SqlParameter("@Desc10", parm10));

                da = new SqlDataAdapter(cmd);
                dt = new DataTable();
                da.Fill(dt);
                dbConn.Close();

                return dt;
            }
            catch
            {
                throw new Exception();
            }
        }

        public DataSet select_dataset_dt_10(string ProcName, string CallType, string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "", string parm9 = "", string parm10 = "")
        {
            try
            {
                dbConn = new SqlConnection(ConnectionString);
                dbConn.Open();
                cmd = new SqlCommand(ProcName, dbConn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@CallType", CallType));
                cmd.Parameters.Add(new SqlParameter("@Desc1", parm1));
                cmd.Parameters.Add(new SqlParameter("@Desc2", parm2));
                cmd.Parameters.Add(new SqlParameter("@Desc3", parm3));
                cmd.Parameters.Add(new SqlParameter("@Desc4", parm4));
                cmd.Parameters.Add(new SqlParameter("@Desc5", parm5));
                cmd.Parameters.Add(new SqlParameter("@Desc6", parm6));
                cmd.Parameters.Add(new SqlParameter("@Desc7", parm7));
                cmd.Parameters.Add(new SqlParameter("@Desc8", parm8));
                cmd.Parameters.Add(new SqlParameter("@Desc9", parm9));
                cmd.Parameters.Add(new SqlParameter("@Desc10", parm10));
                da = new SqlDataAdapter(cmd);
                ds = new DataSet();
                da.Fill(ds);
                dbConn.Close();
                return ds;
            }
            catch
            {
                throw new Exception();
            }
        }
        public DataSet GetUserPermission(string userId)
        {
            return select_dataset_dt_10("sp_Select_User_Permission", "get_user_permission", userId);
        }
        public string GetPermission(string userId)
        {
            string condition1 = "";
            //getPermission
            var dtCompany = new DataTable();
            var dtUnit = new DataTable();
            var dtDept = new DataTable();
            var dsPermission = GetUserPermission(userId);
            if (dsPermission != null)
            {
                dtCompany = dsPermission.Tables[0];
                dtUnit = dsPermission.Tables[1];
                dtDept = dsPermission.Tables[2];

                if (dtCompany != null && dtCompany.Rows.Count > 0)
                {
                    string companyIds = string.Join(",", dtCompany.Rows.OfType<DataRow>().Select(x => x[0].ToString()));
                    condition1 += " AND COM.CompanyId in (" + companyIds + ")";
                }
                if (dtUnit != null && dtUnit.Rows.Count > 0)
                {
                    string unitIds = string.Join(",", dtUnit.Rows.OfType<DataRow>().Select(x => x[0].ToString()));
                    condition1 += " AND B.UnitId in (" + unitIds + ")";
                }
                if (dtDept != null && dtDept.Rows.Count > 0)
                {
                    string departmentIds = string.Join(",", dtDept.Rows.OfType<DataRow>().Select(x => x[0].ToString()));
                    condition1 += " AND B.DepartmentId in (" + departmentIds + ")";
                }
            }

            return condition1;
        }

        public string GetUserCompanyPermission(string userId)
        {
            string companyIds = "";
            var dtCompany = new DataTable();
            var dsPermission = GetUserPermission(userId);
            if (dsPermission != null)
            {
                dtCompany = dsPermission.Tables[0];
                if (dtCompany != null && dtCompany.Rows.Count > 0)
                {
                    companyIds = string.Join(",", dtCompany.Rows.OfType<DataRow>().Select(x => x[0].ToString()));
                }
            }
            return companyIds;
        }


        public UserPermission GetUserUnitPermission(string userId)
        {
            var rv = new UserPermission();
            string unitIds = "";
            var dtUnit = new DataTable();
            var dsPermission = GetUserPermission(userId);
            if (dsPermission != null)
            {
                dtUnit = dsPermission.Tables[1];
                if (dtUnit != null && dtUnit.Rows.Count > 0)
                {
                    unitIds = string.Join(",", dtUnit.Rows.OfType<DataRow>().Select(x => x[0].ToString()));
                }
                if (dsPermission.Tables[0] != null && dsPermission.Tables[0].Rows.Count > 0)
                {
                    rv.IsCompanyPermission = true;
                }
            }
            rv.Result = unitIds;
            return rv;
        }
        public UserPermission GetUserDepartmentPermission(string userId)
        {
            var rv = new UserPermission();
            string departmentIds = "";
            var dtDept = new DataTable();
            var dsPermission = GetUserPermission(userId);
            if (dsPermission != null)
            {
                dtDept = dsPermission.Tables[2];
                if (dtDept != null && dtDept.Rows.Count > 0)
                {
                    departmentIds = string.Join(",", dtDept.Rows.OfType<DataRow>().Select(x => x[0].ToString()));
                }
                if (dsPermission.Tables[0] != null && dsPermission.Tables[0].Rows.Count > 0)
                {
                    rv.IsCompanyPermission = true;
                }

            }
            rv.Result = departmentIds;
            return rv;
        }
    }
}
