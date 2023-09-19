namespace Entities.HRM.DTO
{
    public class SiteDutyRollBack
    {
        public string EmpName { get; set; }
        public string EmpCode { get; set; }
        public string TourName { get; set; }
        public int SDId { get; set; }
        public long EmpID { get; set; }
        public int TourId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public decimal NoOfDays { get; set; }
        public string Reason { get; set; }
        public string UserId { get; set; }
        public string TerminalId { get; set; }
        public int IsManual { get; set; }
    }
}
