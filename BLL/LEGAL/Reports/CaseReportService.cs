using DAL.LEGAL.Reports;
using DBManager;
using Entities.LEGAL.ReportEntity;
using System.Data;

namespace BLL.LEGAL.Reports
{
    public class CaseReportService : ICaseReportRepository
    {
        readonly LegalReportsDataService _legalReportsDataService = new LegalReportsDataService();

        public DataSet GetAllCaseData(int fileType, int court, int status, int unit, int assignLawyer, bool isPublish, int district, int matter)
        {
            int a = 0;
            string condition = " Where a.IsDeleted = 0  ";
            string query = "";

            if (fileType > 0)
            {
                condition += "AND a.FileTypeId = '" + fileType + "'";
                a++;
            }
            if (court > 0)
            {
                if (fileType > 0)
                {
                    condition += " AND a.CourtId = '" + court + "'";
                }
                else
                {
                    condition += "AND a.CourtId = '" + court + "'";

                }
                a++;
            }
            if (status > 0)
            {
                if (fileType > 0 || court > 0)
                {
                    condition += " AND a.StatusId = '" + status + "'";
                }
                else
                {
                    condition += "AND a.StatusId = '" + status + "'";
                }
                a++;
            }
            if (unit > 0)
            {
                if (fileType > 0 || court > 0 || status > 0)
                {
                    condition += " AND a.UnitId = '" + unit + "'";
                }
                else
                {
                    condition += "AND a.UnitId = '" + unit + "'";
                }
                a++;
            }

            if (assignLawyer > 0)
            {
                if (fileType > 0 || court > 0 || status > 0 || unit > 0)
                {
                    condition += " AND a.AssignLawyer = '" + assignLawyer + "'";
                }
                else
                {
                    condition += "AND a.AssignLawyer = '" + assignLawyer + "'";
                }
                a++;
            }

            if (isPublish == true)
            {
                if (fileType > 0 || court > 0 || status > 0 || unit > 0 || assignLawyer > 0)
                {
                    condition += " AND a.Is_Publish = '" + isPublish + "'";
                }
                else
                {
                    condition += "AND a.Is_Publish = '" + isPublish + "'";
                }
                a++;
            }
            else
            {
                condition += " And a.Is_Publish = '" + isPublish + "'";
            }

            if (district > 0)
            {
                if (fileType > 0 || court > 0 || status > 0 || unit > 0 || assignLawyer > 0 || isPublish == true)
                {
                    condition += " AND b.DistrictId = '" + district + "'";
                }
                else
                {
                    condition += "AND b.DistrictId = '" + district + "'";
                }
                a++;
            }

            if (matter > 0)
            {
                if (fileType > 0 || court > 0 || status > 0 || unit > 0 || assignLawyer > 0 || isPublish == true || district > 0)
                {
                    condition += " AND a.MatterId = '" + matter + "'";
                }
                else
                {
                    condition += "AND a.MatterId = '" + matter + "'";
                }
                a++;
            }
            if (a == 0)
            {
                condition = "Where a.Is_Publish = 'False'";
            }

            return _legalReportsDataService.GetAllCaseData(fileType, court, status, unit, assignLawyer, isPublish, district, matter, condition);

        }

        public GridEntity<CaseFilesVm> GetCaseFileReportGrid(GridOptions options, int fileType, int court,int status, int unit)
        {
            int a = 0;
            string condition = " Where ";

            if (fileType > 0)
            {
                condition += "a.FileTypeId = '" + fileType + "'";
                a++;
            }
            if (court > 0)
            {
                if (fileType > 0)
                {
                    condition += " AND a.CourtId = '" + court + "'";
                }
                else
                {
                    condition += " a.CourtId = '" + court + "'";

                }
                a++;
            }
            if (status > 0)
            {
                if (fileType > 0 || court > 0)
                {
                    condition += " AND a.StatusId = '" + status + "'";
                }
                else
                {
                    condition += "a.StatusId = '" + status + "'";
                }
                a++;
            }
            if (unit > 0)
            {
                if (fileType > 0 || court > 0 || status > 0)
                {
                    condition += " AND a.UnitId = '" + unit + "'";
                }
                else
                {
                    condition += "a.UnitId = '" + unit + "'";
                }
                a++;
            }
            if (a == 0)
            {
                condition = "";
            }


            return _legalReportsDataService.GetCaseFileReportGrid(options, fileType, court,status, unit,condition);
        }
    }
}
