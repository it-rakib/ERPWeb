using DAL.LAND.Reports;
using Entities.LAND.ReportEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.LAND.Reports
{
    public class LandReportService : ILandReportRepository
    {
        readonly LandReportDataService _landReportDataService = new LandReportDataService();
        public DataSet GetDistrictWiseReport()
        {
            return _landReportDataService.GetDistrictWiseReport();
        }             

        public DataSet GetUpozillaWiseReport()
        {
            return _landReportDataService.GetUpozilaWiseReport();
        }

        public DataSet GetUpozillaWiseMutationReport(Guid upozilaId)
        {
            return _landReportDataService.GetUpozilaWiseMutationReport(upozilaId);
        }
        public DataSet GetMouzaWiseReport()
        {
            return _landReportDataService.GetMouzaWiseReport();
        }
        public DataSet GetOwnerWiseReport()
        {
            return _landReportDataService.GetOwnerWiseReport();
        }

        public DataSet GetFileWiseReport()
        {
            return _landReportDataService.GetFileWiseReport();
        }

        public DataSet GetDivisionWiseReport(Guid divisionId)
        {
            return _landReportDataService.GetDivisionWiseReport(divisionId);
        }
        public DataSet GetDivisionWiseMutationReport(Guid divisionId)
        {
            return _landReportDataService.GetDivisionWiseMutationReport(divisionId);
        }
        public DataSet GetDistrictWiseSingleReport(Guid districtId)
        {
            return _landReportDataService.GetDistrictWiseSingleReport(districtId);
        }
        public DataSet GetDistrictWiseSingleMutationReport(Guid districtId)
        {
            return _landReportDataService.GetDistrictWiseSingleMutationReport(districtId);
        }
        public DataSet GetUpozillaWiseSingleReport(Guid upozilaId)
        {
            return _landReportDataService.GetUpozilaWiseSingleReport(upozilaId);
        }

        public DataSet GetMouzaWiseSingleReport(Guid mouzaId)
        {
            return _landReportDataService.GetMouzaWiseSingleReport(mouzaId);
        }

        public DataSet GetOwnerWiseSingleReport(Guid mouzaId,Guid ownerInfoId)
        {
            return _landReportDataService.GetOwnerWiseSingleReport(mouzaId,ownerInfoId);
        }
        public DataSet GetOwnerWiseSingleSummaryReport(Guid ownerInfoId)
        {
            return _landReportDataService.GetOwnerWiseSingleSummaryReport(ownerInfoId);
        }

        public DataSet GetOwnerWiseMutationReport(Guid mouzaId, Guid ownerInfoId)
        {
            return _landReportDataService.GetOwnerWiseMutationReport(mouzaId, ownerInfoId);
        }
        public DataSet GetMouzaWiseMutationReport(Guid mouzaId)
        {
            return _landReportDataService.GetMouzaWiseMutationReport(mouzaId);
        }
        public DataSet GetSingleOwnerWiseMutationSummaryReport(Guid ownerInfoId)
        {
            return _landReportDataService.GetSingleOwnerWiseMutationSummaryReport(ownerInfoId);
        }
    }
}
