using Entities.LAND.ReportEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.LAND.Reports
{
    public interface ILandReportRepository
    {
        DataSet GetDistrictWiseReport();
        DataSet GetUpozillaWiseReport();
        DataSet GetUpozillaWiseMutationReport(Guid upozilaId);
        DataSet GetMouzaWiseReport();
        DataSet GetOwnerWiseReport();
        DataSet GetFileWiseReport();
        DataSet GetDivisionWiseReport(Guid divisionId);
        DataSet GetDivisionWiseMutationReport(Guid divisionId);
        DataSet GetDistrictWiseSingleReport(Guid districtId);
        DataSet GetDistrictWiseSingleMutationReport(Guid districtId);
        DataSet GetUpozillaWiseSingleReport(Guid upozilaId);
        DataSet GetMouzaWiseSingleReport(Guid mouzaId);
        DataSet GetOwnerWiseSingleReport(Guid mouzaId,Guid ownerInfoId);
        DataSet GetOwnerWiseSingleSummaryReport(Guid ownerInfoId);
        DataSet GetOwnerWiseMutationReport(Guid mouzaId, Guid ownerInfoId);
        DataSet GetSingleOwnerWiseMutationSummaryReport(Guid ownerInfoId);
        DataSet GetMouzaWiseMutationReport(Guid mouzaId);
    }
}
