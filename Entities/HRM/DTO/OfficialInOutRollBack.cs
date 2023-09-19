namespace Entities.HRM.DTO
{
    public class OfficialInOutRollBack
    {
        public string EmpName { get; set; }
        public string EmpCode { get; set; }
        public string TourName { get; set; }
        public int IOId { get; set; }
        public long EmpID { get; set; }
        public string InOutDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Duration { get; set; }
        public string Reason { get; set; }
        public string UserId { get; set; }
        public string TerminalId { get; set; }
        public int IsManual { get; set; }
    }
}
