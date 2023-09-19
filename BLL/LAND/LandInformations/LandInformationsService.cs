using DAL.LAND.LandInformations;
using DBManager;
using Entities.LAND.LandInformationsEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.LAND.LandInformations
{
    public class LandInformationsService : ILandInformationsRepository
    {
        readonly LandInformationsDataService _LandInformationsDataService = new LandInformationsDataService();

        public GridEntity<LandInformationsVm> GetLandInformationsSummary(GridOptions options)
        {
            return _LandInformationsDataService.GetLandInformationsSummary(options);
        }
    }
}
