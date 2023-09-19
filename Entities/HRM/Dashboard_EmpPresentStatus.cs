namespace Entities.HRM
{
    public class Dashboard_EmpPresentStatus
    {
        public string WorkDay { get; set; }
        public int PresentEmp { get; set; }
        public int AbsentEmp { get; set; }
        public int SiteDutyEmp { get; set; }
        public int InOutEmp { get; set; }

        public string PresetnColor { get; set; } = "#2ACAAD";
        public string AbsentColor { get; set; } = "#E57272";
        public string SiteDutyColor { get; set; } = "#64AEF3";
        public string InOutColor { get; set; } = "#CD7FE8";
        public string TotalEmpColor { get; set; } = "#2A8DCA";

        public string DepartmentName { get; set; }
        public int TotalEmp { get; set; }

    }
    public class Dashboard_EmpAttStatus
    {
        public string AttStatus { get; set; }
        public int TotalEmp { get; set; }
        public string color { get; set; }
        public string labelColor { get; set; }
    }
}
