using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBManager;
using Entities.LEGAL.LegalDashboardEntity;

namespace BLL.LEGAL.LegalDashboard
{
    public interface ILegalDashboardRepository
    {
        GridEntity<LegalDashboardVm> GetAllOverDatedGridData(GridOptions options);
    }
}
