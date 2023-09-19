namespace Entities.HRM.DTO
{
    public class ManualLeaveRollBack
    {
        public string EmpName { get; set; }
        public string EmpCode { get; set; }
        public string LeaveName { get; set; }
        public int LRId { get; set; }
        public long EmpID { get; set; }
        public int LeaveId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public decimal NoOfDays { get; set; }
        public string Reason { get; set; }
        public string UserId { get; set; }
        public string TerminalId { get; set; }
        public int IsManual { get; set; }

    }
}
