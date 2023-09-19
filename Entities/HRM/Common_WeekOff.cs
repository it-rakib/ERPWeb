using System;

namespace Entities.HRM
{
    public class Common_WeekOff
    {
        public long EmpID { get; set; }
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }
        public int DayID { get; set; }
        public string DayName { get; set; }
    }
}
