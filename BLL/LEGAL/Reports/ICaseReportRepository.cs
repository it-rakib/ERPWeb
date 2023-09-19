using DBManager;
using Entities.LEGAL.ReportEntity;
using System.Data;

namespace BLL.LEGAL.Reports
{
    public interface ICaseReportRepository
    {
        DataSet GetAllCaseData(int fileType,int court,int status,int unit, int assignLawyer, bool isPublish, int district, int matter);
        //GridEntity<CaseFilesVm> GetCaseFileReportGrid(GridOptions options);
        GridEntity<CaseFilesVm> GetCaseFileReportGrid(GridOptions options, int fileType, int court,int status, int unit);
    }
}
