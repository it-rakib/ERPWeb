using DBManager;
using Entities.LAND.LandInformationsEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.LAND.MutationLandInformations
{
    public interface IMutationLandInformationsRepository
    {
        GridEntity<LandInformationsVm> GetMutationLandInformationsSummary(GridOptions options);
    }
}
