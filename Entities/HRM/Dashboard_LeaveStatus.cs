namespace Entities.HRM
{
    public class Dashboard_LeaveStatus
    {
        public string LeaveMonth { get; set; }
        public int TotalLeave { get; set; }
        public int LeavePer { get; set; }
        public string LeaveMonthSt => this.LeaveMonth + " (" + this.TotalLeave + ")";
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
    }
}
