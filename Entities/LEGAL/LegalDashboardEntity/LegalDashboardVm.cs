using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.LEGAL.LegalDashboardEntity
{
    public class LegalDashboardVm
    {
        public int? FileMasterId { get; set; }
        public string RegNo { get; set; }
        public int FileTypeId { get; set; }
        public string FileTypeName { get; set; }
        public int CourtId { get; set; }
        public string CourtName { get; set; }
        public string CaseNo { get; set; }
        public int AssignLawyer { get; set; }
        public string AssignLawyerName { get; set; }
        public bool? IsPublish { get; set; }
        public string Petitioner { get; set; }
        public string OppositeParty { get; set; }
        public int DiaryId { get; set; }
        public DateTime? PreviousDate { get; set; }
        public DateTime? NextDate { get; set; }
        public string NextDateFor { get; set; }
        public int? StatusId { get; set; }
        public string StatusName { get; set; }
    }
}
