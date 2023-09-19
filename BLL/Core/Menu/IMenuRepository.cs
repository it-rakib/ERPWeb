using DBManager;
using Entities.Core.Menu;
using Entities.Core.User;
using System.Collections.Generic;

namespace BLL.Core.Menu
{
    public interface IMenuRepository
    {
        string SaveMenu(Entities.Core.Menu.Menu menu);
        GridEntity<Entities.Core.Menu.Menu> GetMenuSummary(GridOptions options, string projId, string moduleId);
        List<Entities.Core.Menu.Menu> SelectAllMenuByModuleId(int moduleId);
        List<Entities.Core.Menu.Menu> SelectAllMenu(string projId, string moduleId);
        string UpdateMenuSorting(List<Entities.Core.Menu.Menu> menuList, UserInfo user);
        List<Entities.Core.Menu.Menu> SelectMenuByUserPermission(string userId, int nModuleId);
        GridEntity<MenuPermission> GetMenuPermissionSummary(GridOptions options, string usrid, int moduleId, int projectId);
        UserAccessPermission SaveAccessPermission(UserAccessPermission objAccess);
        GridEntity<ReportPermission> GetReportPermissionSummary(GridOptions options, string usrId, int menuId);
    }
}
