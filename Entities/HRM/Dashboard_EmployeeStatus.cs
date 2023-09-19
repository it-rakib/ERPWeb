namespace Entities.HRM
{
    public class Dashboard_EmployeeStatus
    {
        public int TotalEmployee { get; set; }
        public int ActiveEmp { get; set; }
        public int TotalMale { get; set; }
        public int TotalFemale { get; set; }
        public int Salaries { get; set; }
        public int TotalExpatriateEmp { get; set; }
        public int MalePer { get; set; }
        public int FemalePer { get; set; }
        public int ActiveEmpPer { get; set; }
        public int ExpatriatePer { get; set; }

        public int TotalPresent { get; set; }
        public int TotalAbsent { get; set; }
        public int TotalOnLeave { get; set; }
        public int TotalOnSiteDuty { get; set; }
        public int TotalOnInOut { get; set; }
        public int TotalOnWeekOff { get; set; }
        public int TotalOnLayOff { get; set; }
        public int TotalAbsentWOLO { get; set; }
        public int DegreeId { get; set; }
        public string DegreeName { get; set; }
    }
}
