using DAL.Core;
using Entities.Core.Module;
using System.Collections.Generic;

namespace BLL.Core.Module
{
    public class ModuleService : IModuleRepository
    {
        readonly ModuleDataService _moduleDataService = new ModuleDataService();
        public List<ModuleInfo> SelectAllModule(int projectId)
        {
            return _moduleDataService.SelectAllModule(projectId);
        }

        public List<ModuleInfo> SelectModuleByUserPermission(string userId, int projectId)
        {
            return _moduleDataService.SelectModuleByUserPermission(userId, projectId);
        }
    }
}
