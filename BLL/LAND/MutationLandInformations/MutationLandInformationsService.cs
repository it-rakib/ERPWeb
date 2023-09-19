using DAL.LAND.LandInformations;
using DBManager;
using Entities.LAND.LandInformationsEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.LAND.MutationLandInformations
{
    public class MutationLandInformationsService : IMutationLandInformationsRepository
    {
        readonly LandMutationInformationsDataService _LandMutationInformationsDataService = new LandMutationInformationsDataService();

        public GridEntity<LandInformationsVm> GetMutationLandInformationsSummary(GridOptions options)
        {
           return _LandMutationInformationsDataService.GetMutationLandInformationsSummary(options);
        }
    }
}
