using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.LEGAL.LegalDashboard;
using DBManager;
using Entities.LEGAL.LegalDashboardEntity;

namespace BLL.LEGAL.LegalDashboard
{
    public class LegalDashboardService : ILegalDashboardRepository
    {
        readonly  LegalDashboardDataService _dashboardDataService = new LegalDashboardDataService();

        public GridEntity<LegalDashboardVm> GetAllOverDatedGridData(GridOptions options)
        {
            return _dashboardDataService.GetAllOverDatedGridData(options);
        }
    }
}
