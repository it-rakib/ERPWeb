using DBManager;
using Entities.LAND.LandInformationsEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.LAND.LandInformations
{
    public interface ILandInformationsRepository
    {
        GridEntity<LandInformationsVm> GetLandInformationsSummary(GridOptions options);
        //GridEntity<LandInformationsVm> GetLandInformationByDivision(GridOptions options,Guid divisionId);
    }
}
