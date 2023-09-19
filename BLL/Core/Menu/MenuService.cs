using DAL.Core;
using DBManager;
using Entities.Core.Menu;
using Entities.Core.User;
using System.Collections.Generic;

namespace BLL.Core.Menu
{
    public class MenuService : IMenuRepository
    {
        readonly MenuDataService _menuDataService = new MenuDataService();
        public string SaveMenu(Entities.Core.Menu.Menu menu)
        {
            return _menuDataService.SaveMenu(menu);
        }

        public GridEntity<Entities.Core.Menu.Menu> GetMenuSummary(GridOptions options, string projId, string moduleId)
        {
            return _menuDataService.GetMenuSummary(options, projId, moduleId);
        }

        public List<Entities.Core.Menu.Menu> SelectAllMenuByModuleId(int moduleId)
        {
            return _menuDataService.SelectAllMenuByModuleId(moduleId);
        }

        public List<Entities.Core.Menu.Menu> SelectAllMenu(string projId, string moduleId)
        {
            return _menuDataService.SelectAllMenu(projId, moduleId);
        }

        public string UpdateMenuSorting(List<Entities.Core.Menu.Menu> menuList, UserInfo user)
        {
            return _menuDataService.UpdateMenuSorting(menuList, user);
        }
        public List<Entities.Core.Menu.Menu> SelectMenuByUserPermission(string userId, int nModuleId)
        {
            return _menuDataService.SelectMenuByUserPermission(userId, nModuleId);
        }

        public GridEntity<MenuPermission> GetMenuPermissionSummary(GridOptions options, string usrid, int moduleId, int projectId)
        {
            return _menuDataService.GetMenuPermissionSummary(options, usrid, moduleId, projectId);
        }

        public UserAccessPermission SaveAccessPermission(UserAccessPermission objAccess)
        {
            return _menuDataService.SaveAccessPermission(objAccess);
        }

        public GridEntity<ReportPermission> GetReportPermissionSummary(GridOptions options, string usrId, int menuId)
        {
            return _menuDataService.GetReportPermissionSummary(options, usrId, menuId);
        }
    }
}
