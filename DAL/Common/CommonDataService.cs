using AUtilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;


namespace DAL.Common
{
    public class CommonDataService
    {
        SqlDataAdapter _da;
        SqlConnection _dbConn;
        SqlCommand _cmd;
        DataSet _ds;
        DataTable _dt;
        private readonly string _connectionString = "";
        public CommonDataService(string constringName = "SqlConnectionString")
        {
            _connectionString = System.Configuration.ConfigurationManager.ConnectionStrings[constringName].ConnectionString;
        }
        public DataSet select_data_10(string comCostId, string procName, string callType, string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "", string parm9 = "", string parm10 = "")
        {
            try
            {
                _dbConn = new SqlConnection(_connectionString);
                _dbConn.Open();

                _cmd = new SqlCommand(procName, _dbConn);
                _cmd.CommandType = CommandType.StoredProcedure;

                _cmd.Parameters.Add(new SqlParameter("@ComC1", comCostId));
                _cmd.Parameters.Add(new SqlParameter("@CallType", callType));
                _cmd.Parameters.Add(new SqlParameter("@Desc1", parm1));
                _cmd.Parameters.Add(new SqlParameter("@Desc2", parm2));
                _cmd.Parameters.Add(new SqlParameter("@Desc3", parm3));
                _cmd.Parameters.Add(new SqlParameter("@Desc4", parm4));
                _cmd.Parameters.Add(new SqlParameter("@Desc5", parm5));
                _cmd.Parameters.Add(new SqlParameter("@Desc6", parm6));
                _cmd.Parameters.Add(new SqlParameter("@Desc7", parm7));
                _cmd.Parameters.Add(new SqlParameter("@Desc8", parm8));
                _cmd.Parameters.Add(new SqlParameter("@Desc9", parm9));
                _cmd.Parameters.Add(new SqlParameter("@Desc10", parm10));

                _da = new SqlDataAdapter(_cmd);
                _ds = new DataSet();
                _da.Fill(_ds);
                _dbConn.Close();

                return _ds;
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
                _dbConn = new SqlConnection(_connectionString);
                _dbConn.Open();

                _cmd = new SqlCommand(procedureName, _dbConn);
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Parameters.Add(new SqlParameter("@CallType", callName));
                _cmd.Parameters.Add(new SqlParameter("@Desc1", parm1));
                _cmd.Parameters.Add(new SqlParameter("@Desc2", parm2));
                _cmd.Parameters.Add(new SqlParameter("@Desc3", parm3));
                _cmd.Parameters.Add(new SqlParameter("@Desc4", parm4));
                _cmd.Parameters.Add(new SqlParameter("@Desc5", parm5));
                _cmd.Parameters.Add(new SqlParameter("@Desc6", parm6));
                _cmd.Parameters.Add(new SqlParameter("@Desc7", parm7));
                _cmd.Parameters.Add(new SqlParameter("@Desc8", parm8));
                _cmd.Parameters.Add(new SqlParameter("@Desc9", parm9));
                _cmd.Parameters.Add(new SqlParameter("@Desc10", parm10));

                _da = new SqlDataAdapter(_cmd);
                _ds = new DataSet();
                _da.Fill(_ds);
                _dbConn.Close();

                _dt = _ds.Tables[0];
                var dataList = new List<T>();

                if (_dt.Rows.Count > 0)
                {
                    dataList = (List<T>)ListConversion.ConvertTo<T>(_dt);
                }

                return dataList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public DataSet GetDataSet(String sql)
        {
            try
            {
                _ds = new DataSet();
                _dbConn = new SqlConnection(_connectionString);
                _dbConn.Open();
                SqlDataAdapter da = new SqlDataAdapter(sql, _dbConn);
                da.Fill(_ds);
                return _ds;
            }
            catch (Exception ex)
            {
                throw new Exception();
            }
            finally
            {
                _dbConn.Close();
                _dbConn.Dispose();
            }

        }
        public DataSet GetDataSetWithConStr(String sql, string conStr)
        {
            try
            {
                _ds = new DataSet();
                _dbConn = new SqlConnection(conStr);
                _dbConn.Open();
                SqlDataAdapter da = new SqlDataAdapter(sql, _dbConn);
                da.Fill(_ds);
                return _ds;
            }
            catch (Exception ex)
            {
                throw new Exception();
            }
            finally
            {
                _dbConn.Close();
                _dbConn.Dispose();
            }

        }

        public DataTable select_data_dt_10(string comCostID, string ProcName, string CallType, string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "", string parm9 = "", string parm10 = "")
        {
            try
            {
                _dbConn = new SqlConnection(_connectionString);
                _dbConn.Open();

                _cmd = new SqlCommand(ProcName, _dbConn);
                _cmd.CommandType = CommandType.StoredProcedure;

                _cmd.Parameters.Add(new SqlParameter("@ComC1", comCostID));
                _cmd.Parameters.Add(new SqlParameter("@CallType", CallType));
                _cmd.Parameters.Add(new SqlParameter("@Desc1", parm1));
                _cmd.Parameters.Add(new SqlParameter("@Desc2", parm2));
                _cmd.Parameters.Add(new SqlParameter("@Desc3", parm3));
                _cmd.Parameters.Add(new SqlParameter("@Desc4", parm4));
                _cmd.Parameters.Add(new SqlParameter("@Desc5", parm5));
                _cmd.Parameters.Add(new SqlParameter("@Desc6", parm6));
                _cmd.Parameters.Add(new SqlParameter("@Desc7", parm7));
                _cmd.Parameters.Add(new SqlParameter("@Desc8", parm8));
                _cmd.Parameters.Add(new SqlParameter("@Desc9", parm9));
                _cmd.Parameters.Add(new SqlParameter("@Desc10", parm10));

                _da = new SqlDataAdapter(_cmd);
                _dt = new DataTable();
                _da.Fill(_dt);
                _dbConn.Close();

                return _dt;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public T Select_Data_Object<T>(string procedureName, string callName, string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "", string parm9 = "", string parm10 = "")
        {
            try
            {
                _dbConn = new SqlConnection(_connectionString);
                _dbConn.Open();

                _cmd = new SqlCommand(procedureName, _dbConn);
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Parameters.Add(new SqlParameter("@CallType", callName));
                _cmd.Parameters.Add(new SqlParameter("@Desc1", parm1));
                _cmd.Parameters.Add(new SqlParameter("@Desc2", parm2));
                _cmd.Parameters.Add(new SqlParameter("@Desc3", parm3));
                _cmd.Parameters.Add(new SqlParameter("@Desc4", parm4));
                _cmd.Parameters.Add(new SqlParameter("@Desc5", parm5));
                _cmd.Parameters.Add(new SqlParameter("@Desc6", parm6));
                _cmd.Parameters.Add(new SqlParameter("@Desc7", parm7));
                _cmd.Parameters.Add(new SqlParameter("@Desc8", parm8));
                _cmd.Parameters.Add(new SqlParameter("@Desc9", parm9));
                _cmd.Parameters.Add(new SqlParameter("@Desc10", parm10));

                _da = new SqlDataAdapter(_cmd);
                _ds = new DataSet();
                _da.Fill(_ds);
                _dbConn.Close();

                _dt = _ds.Tables[0];
                var dataList = new List<T>();

                if (_dt.Rows.Count > 0)
                {
                    dataList = (List<T>)ListConversion.ConvertTo<T>(_dt);
                }

                return dataList.SingleOrDefault();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public DataTable GetDataTableWithContStr(String sql, string conStr)
        {
            try
            {
                _dt = new DataTable();
                _dbConn = new SqlConnection(conStr);
                _dbConn.Open();
                SqlDataAdapter da = new SqlDataAdapter(sql, _dbConn);
                da.Fill(_dt);
                return _dt;
            }
            catch (Exception ex)
            {
                throw new Exception();
            }
            finally
            {
                _dbConn.Close();
                _dbConn.Dispose();
            }

        }

    }
}
