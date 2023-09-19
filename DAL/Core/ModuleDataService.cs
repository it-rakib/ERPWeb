using DAL.Common;
using Entities.Core.Module;
using System.Collections.Generic;

namespace DAL.Core
{
    public class ModuleDataService
    {
        CommonDataService _commonDataService = new CommonDataService();
        public List<ModuleInfo> SelectAllModule(int projectId)
        {
            var res = _commonDataService.Select_Data_List<ModuleInfo>("SP_SELECT_MODULE", "GET_ALL_MODULE", projectId.ToString());
            return res;
        }

        public List<ModuleInfo> SelectModuleByUserPermission(string userId, int projectId)
        {
            var res = _commonDataService.Select_Data_List<ModuleInfo>("SP_SELECT_MODULE", "GET_ALL_MODULE_BY_USER_PERMISSION", userId, projectId.ToString());
            return res;
        }
    }
}
