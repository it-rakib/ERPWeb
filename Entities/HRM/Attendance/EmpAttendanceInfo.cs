using System;

namespace Entities.HRM.Attendance
{
    public class EmpAttendanceInfo
    {
        public long EmpID { get; set; }
        public string EmpCode { get; set; }
        public string Title { get; set; }
        public string EmpName { get; set; }
        public DateTime JoiningDate { get; set; }
        public string DesignationName { get; set; }
        public string PositionName { get; set; }
        public string CompanyName { get; set; }
        public string UnitName { get; set; }
        public string DepartmentName { get; set; }
        public string SectionName { get; set; }
        public string WingName { get; set; }
        public string JobLocationName { get; set; }
        public string TeamName { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int NoOfDays { get; set; }
    }
}
