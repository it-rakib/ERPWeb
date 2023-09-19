namespace ERP_WEB.LegalReports.Entity
{
    public class CaseReport
    {
        public int SlNo { get; set; }
        public string RegNo { get; set; }
        public string CourtName { get; set; }
        public string CaseNo { get; set; }       
        public string Petitioner { get; set; }
        public string OppositeParty { get; set; }
        public  string NextDate { get; set; }
        public  string NextDateFor { get; set; }
        public string StatusName { get; set; }
       
    }
}