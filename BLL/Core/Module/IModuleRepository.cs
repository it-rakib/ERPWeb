using Entities.Core.Module;
using System.Collections.Generic;

namespace BLL.Core.Module
{
    public interface IModuleRepository
    {
        List<ModuleInfo> SelectAllModule(int projectId);
        List<ModuleInfo> SelectModuleByUserPermission(string userId, int projectId);
    }
}
