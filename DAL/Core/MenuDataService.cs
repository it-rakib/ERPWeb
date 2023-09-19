using DAL.Common;
using DBManager;
using DBManager.StoreProcedure;
using Entities.Core.Menu;
using Entities.Core.User;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace DAL.Core
{
    public class MenuDataService
    {
        SqlDataAdapter da;
        SqlConnection dbConn;
        SqlCommand cmd;
        DataTable dt;
        string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["SqlConnectionString"].ConnectionString;
        readonly CommonDataService _common = new CommonDataService();
        public string SaveMenu(Menu menu)
        {
            string rv = "";
            try
            {
                Insert_Update("SP_INSERT_MENU", "SAVE_MENU_DATA", menu);

                rv = Operation.Success.ToString();
            }
            catch (Exception ex)
            {
                rv = ex.Message;
            }
            return rv;
        }


        public DataTable Insert_Update(string procedure, string callname, Menu menu)
        {
            dbConn = new SqlConnection(ConnectionString);
            dbConn.Open();

            cmd = new SqlCommand(procedure, dbConn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add(new SqlParameter("@call_name", callname));
            cmd.Parameters.Add(new SqlParameter("@p_MENUID", menu.MenuId));
            cmd.Parameters.Add(new SqlParameter("@p_PROJECTID", menu.ProjectId));
            cmd.Parameters.Add(new SqlParameter("@p_MODULEID", menu.ModuleId));
            cmd.Parameters.Add(new SqlParameter("@p_MENUNAME", menu.MenuName));
            cmd.Parameters.Add(new SqlParameter("@p_MENUPATH", menu.MenuPath));
            cmd.Parameters.Add(new SqlParameter("@p_PARENTMENU", menu.ParentMenu));
            cmd.Parameters.Add(new SqlParameter("@p_TODO", menu.ToDo));

            //cmd.Parameters.Add(new SqlParameter("@p_USERID", menu.UserId));
            //cmd.Parameters.Add(new SqlParameter("@p_ISACTV", menu.IsActive));
            //cmd.Parameters.Add(new SqlParameter("@p_TERMID", menu.TermId));
            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            da.Fill(dt);

            dbConn.Close();
            return dt;
        }

        public GridEntity<Menu> GetMenuSummary(GridOptions options, string projId, string moduleId)
        {
            projId = projId == "0" ? "%" : projId == "" ? "%" : projId;
            moduleId = moduleId == "0" ? "%" : moduleId == "" ? "%" : moduleId;
            return KendoGrid<Menu>.GetGridData_5(options, "SP_SELECT_MENU_GRID", "GET_MENU_INFO", "ProjectName,MODULENAME,MENUNAME,ParentMenu", projId, moduleId);
        }

        public List<Menu> SelectAllMenuByModuleId(int moduleId)
        {
            return _common.Select_Data_List<Menu>("SP_SELECT_MENU", "GET_MENU_BY_MODULEID", moduleId.ToString());
        }

        public List<Menu> SelectAllMenu(string projId, string moduleId)
        {
            projId = projId == "0" ? "%" : projId == "" ? "%" : projId;
            moduleId = moduleId == "0" ? "%" : moduleId == "" ? "%" : moduleId;
            return _common.Select_Data_List<Menu>("SP_SELECT_MENU", "GET_ALL_MENU_FOR_SORTING", projId, moduleId);
        }

        public string UpdateMenuSorting(List<Menu> menuList, UserInfo user)
        {
            string res = "";
            CommonConnection con = new CommonConnection();
            try
            {
                var quary = "";
                foreach (var menu in menuList)
                {
                    quary += string.Format(" Update Menu Set SorOrder = {0} where MenuId = {1};", menu.SortOrder, menu.MenuId);
                }
                if (quary != "")
                {
                    con.ExecuteNonQuery(quary);
                }
                res = Operation.Success.ToString();
            }
            catch (Exception ex)
            {
                res = Operation.Failed.ToString();
            }
            return res;
        }

        public List<Menu> SelectMenuByUserPermission(string userId, int nModuleId)
        {
            return _common.Select_Data_List<Menu>("SP_SELECT_MENU", "GET_MENU_BY_USER", userId, nModuleId.ToString());
        }

        public GridEntity<MenuPermission> GetMenuPermissionSummary(GridOptions options, string usrid, int moduleId, int projectId)
        {
            string mdlId = moduleId.ToString() == "0" ? "%" : moduleId.ToString();
            return KendoGrid<MenuPermission>.GetGridData_5(options, "SP_SELECT_MENU_GRID", "GET_MENU_PERMISSION", "MODULENAME", usrid, mdlId, projectId.ToString());
        }
        public UserAccessPermission SaveAccessPermission(UserAccessPermission objAccess)
        {
            var rv = new UserAccessPermission();
            try
            {
                var dt = Insert_Update_AccessPermission("Sp_Insert_AccessPermission", "Save_Access_Permission", objAccess);
                rv.AccessPermissionId = Convert.ToInt32(dt.Rows[0]["AccessPermissionId"]);
                rv.ReturnStatus = Operation.Success.ToString();
            }
            catch (Exception ex)
            {
                rv.ReturnStatus = ex.Message;
            }
            return rv;
        }
        public DataTable Insert_Update_AccessPermission(string procedure, string callname, UserAccessPermission objAccess)
        {
            dbConn = new SqlConnection(ConnectionString);
            dbConn.Open();
            cmd = new SqlCommand(procedure, dbConn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(new SqlParameter("@call_name", callname));
            cmd.Parameters.Add(new SqlParameter("@p_AccessPermissionId", objAccess.AccessPermissionId));
            cmd.Parameters.Add(new SqlParameter("@p_UserId", objAccess.UserId));
            cmd.Parameters.Add(new SqlParameter("@p_MenuId", objAccess.MenuId));
            cmd.Parameters.Add(new SqlParameter("@p_CanInsert", objAccess.CanInsert));
            cmd.Parameters.Add(new SqlParameter("@p_CanEdit", objAccess.CanEdit));
            cmd.Parameters.Add(new SqlParameter("@p_CanDelete", objAccess.CanDelete));
            cmd.Parameters.Add(new SqlParameter("@p_CanView", objAccess.CanView));
            cmd.Parameters.Add(new SqlParameter("@p_EntryUserId", objAccess.EntryUserId));
            cmd.Parameters.Add(new SqlParameter("@p_TerminalId", objAccess.TerminalId));
            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            da.Fill(dt);
            dbConn.Close();
            return dt;
        }
        public GridEntity<ReportPermission> GetReportPermissionSummary(GridOptions options, string usrId, int menuId)
        {
            string mdlId = menuId.ToString() == "0" ? "%" : menuId.ToString();
            return KendoGrid<ReportPermission>.GetGridData_5(options, "SP_SELECT_MENU_GRID", "GET_REPORT_PERMISSION", "MENUNAME", usrId, mdlId);
        }
    }
}
