using DBManager;
using Entities.Core.Menu;
using Entities.Core.User;
using System.Collections.Generic;


namespace BLL.Core.User
{
    public interface IUserRepository
    {
        List<UserInfo> GetUserList();
        GridEntity<UserInfo> GetUserSummary(GridOptions options, string usrId);
        string SaveUserPermission(MenuPermission usrObj, List<MenuPermission> objUserMenuList, List<MenuPermission> objRemovedMenuList, List<ReportPermission> objUserReportList, List<ReportPermission> objRemovedReportList);
        string ChangePassword(string curpassword, string newpassword, string usrid, string usrsname, UserInfo user);
        UserInfo GetUserInfoById(string usrid);
        bool CheckUserMenuPermission(string userid, string pageurl);
        UserAccessPermission GetUserAccessPermission(string userid, string pageurl);
        List<ReportPermission> GetReportComboData(int menuId, string userid);
        List<UserInfo> GetUserList(string srcKey);
    }
}
