namespace Entities.HRM
{
    public class Dashboard_EmpAttendance
    {
        public int EmpId { get; set; }
        public string Present { get; set; }
        public string Absent { get; set; }
        public string DayOff { get; set; }
        public string PresentPer { get; set; }
        public string AbsentPer { get; set; }
        public string DayOffPer { get; set; }

        public string AttType { get; set; }
        public string NoOfDays { get; set; }
        public string Color { get; set; }
    }
}
