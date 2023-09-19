using Entities.LAND.ReportEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entities.INVENTORY;

namespace BLL.INVENTORY.Reports
{
    public interface IInvReportRepository
    {
        DataSet GetMovementReportData(CommonParams objCommonParams);
      
    }
}
