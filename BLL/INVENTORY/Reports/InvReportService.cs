using DAL.LAND.Reports;
using Entities.LAND.ReportEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.INVENTORY.Reports;
using Entities.INVENTORY;


namespace BLL.INVENTORY.Reports
{
    public class InvReportService : IInvReportRepository
    {
        readonly InvReportDataService _invReportDataService = new InvReportDataService();
        public DataSet GetMovementReportData(CommonParams objCommonParams)
        {
            string condition = " Where 1=1 ";
            if (objCommonParams.BuyerId != Guid.Empty)
            {
                condition += " AND ib.BuyerId ='" + objCommonParams.BuyerId + "'";
            }
            if (objCommonParams.StoreId != 0)
            {
                condition += " AND ib.StoreId =" + objCommonParams.StoreId;
            }
            if (objCommonParams.StyleDetailsId != Guid.Empty)
            {
                condition += " AND ib.StyleDetailsId ='" + objCommonParams.StyleDetailsId + "'";
            }

            return _invReportDataService.GetMovementReport(condition);
        }
    }
}
