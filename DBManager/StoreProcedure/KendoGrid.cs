using AUtilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace DBManager.StoreProcedure
{
    public class KendoGrid<T>
    {
        private static SqlDataAdapter da;
        private static SqlConnection dbConn;
        private static SqlCommand cmd;
        private static DataSet ds;
        private static DataTable dt;
        private static int totalCount = 0;
        private static string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["SqlConnectionString"].ConnectionString;
        public static GridEntity<T> GetGridData(GridOptions gridOption, string ProcName, string CallType, string orderby, int param1 = 0, string param2 = "")
        {
            try
            {
                gridOption.take = gridOption.skip + gridOption.take;
                var filterby = "";
                if (gridOption.filter != null)
                {
                    filterby = gridOption != null ? GridQueryBuilder<T>.FilterCondition(gridOption.filter) : "";
                }

                dbConn = new SqlConnection(ConnectionString);
                dbConn.Open();
                cmd = new SqlCommand(ProcName, dbConn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@CallType", CallType));
                cmd.Parameters.Add(new SqlParameter("@skip", gridOption.skip));
                cmd.Parameters.Add(new SqlParameter("@take ", gridOption.take));
                cmd.Parameters.Add(new SqlParameter("@filter", filterby));
                cmd.Parameters.Add(new SqlParameter("@orderby", orderby.Trim()));
                cmd.Parameters.Add(new SqlParameter("@param1", param1));
                cmd.Parameters.Add(new SqlParameter("@param2", param2));
                da = new SqlDataAdapter(cmd);
                ds = new DataSet();
                da.Fill(ds);
                dbConn.Close();

                dt = ds.Tables[1];
                totalCount = Convert.ToInt32(ds.Tables[0].Rows[0]["TotalCount"]);
                var dataList = (List<T>)ListConversion.ConvertTo<T>(dt).ToList();
                var result = new GridResult<T>().Data(dataList, totalCount);
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static GridEntity<T> GetGenericGridData(GridOptions gridOption, string ProcName, string CallType, string orderby, int param1 = 0, string param2 = "")
        {
            try
            {
                gridOption.take = gridOption.skip + gridOption.take;
                var filterby = "";
                if (gridOption.filter != null)
                {
                    filterby = gridOption != null ? GridQueryBuilder<T>.FilterCondition(gridOption.filter) : "";
                }

                dbConn = new SqlConnection(ConnectionString);
                dbConn.Open();
                cmd = new SqlCommand(ProcName, dbConn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@CallType", CallType));
                cmd.Parameters.Add(new SqlParameter("@skip", gridOption.skip));
                cmd.Parameters.Add(new SqlParameter("@take ", gridOption.take));
                cmd.Parameters.Add(new SqlParameter("@filter", filterby));
                cmd.Parameters.Add(new SqlParameter("@orderby", orderby.Trim()));
                cmd.Parameters.Add(new SqlParameter("@param1", param1));
                cmd.Parameters.Add(new SqlParameter("@param2", param2));
                da = new SqlDataAdapter(cmd);
                ds = new DataSet();
                da.Fill(ds);
                dbConn.Close();

                dt = ds.Tables[1];
                totalCount = Convert.ToInt32(ds.Tables[0].Rows[0]["TotalCount"]);
                var dataList = (List<T>)GenericListGenerator.GetList<T>(dt);
                var result = new GridResult<T>().Data(dataList, totalCount);
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static GridEntity<T> GetGridData_5(GridOptions gridOption, string ProcName, string CallType, string orderby, string param1 = "", string param2 = "", string param3 = "", string param4 = "", string param5 = "")
        {
            try
            {
                gridOption.take = gridOption.skip + gridOption.take;
                var filterby = "";
                if (gridOption.filter != null)
                {
                    filterby = gridOption != null ? GridQueryBuilder<T>.FilterCondition(gridOption.filter) : "";
                }
                var dir = "";
                if (gridOption.sort != null)
                {
                    dir = gridOption.sort[0].dir;
                }

                dbConn = new SqlConnection(ConnectionString);
                dbConn.Open();
                cmd = new SqlCommand(ProcName, dbConn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@CallType", CallType));
                cmd.Parameters.Add(new SqlParameter("@skip", gridOption.skip));
                cmd.Parameters.Add(new SqlParameter("@take ", gridOption.take));
                cmd.Parameters.Add(new SqlParameter("@filter", filterby));
                cmd.Parameters.Add(new SqlParameter("@orderby", orderby.Trim() + " " + dir));
                cmd.Parameters.Add(new SqlParameter("@param1", param1));
                cmd.Parameters.Add(new SqlParameter("@param2", param2));
                cmd.Parameters.Add(new SqlParameter("@param3", param3));
                cmd.Parameters.Add(new SqlParameter("@param4", param4));
                cmd.Parameters.Add(new SqlParameter("@param5", param5));
                da = new SqlDataAdapter(cmd);
                ds = new DataSet();
                da.Fill(ds);
                dbConn.Close();

                dt = ds.Tables[1];
                totalCount = Convert.ToInt32(ds.Tables[0].Rows[0]["TotalCount"]);
                var dataList = (List<T>)ListConversion.ConvertTo<T>(dt).ToList();
                var result = new GridResult<T>().Data(dataList, totalCount);
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static GridEntity<T> GetGridData_No_Paging(string comname, string ProcName, string CallType, string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "", string parm9 = "", string parm10 = "")
        {
            try
            {
                dbConn = new SqlConnection(ConnectionString);
                dbConn.Open();
                cmd = new SqlCommand(ProcName, dbConn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@ComC1", comname));
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
                da = new SqlDataAdapter(cmd);
                ds = new DataSet();
                da.Fill(ds);
                dbConn.Close();

                dt = ds.Tables[0];
                totalCount = Convert.ToInt32(ds.Tables[0].Rows.Count);
                var dataList = (List<T>)ListConversion.ConvertTo<T>(dt).ToList();
                var result = new GridResult<T>().Data(dataList, totalCount);
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


    }
}
