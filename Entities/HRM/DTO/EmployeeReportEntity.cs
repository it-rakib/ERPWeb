namespace Entities.HRM.DTO
{
    public class EmployeeReportEntity
    {
        public string EmpID { get; set; }
        public string EmpCode { get; set; }
        public string EmpName { get; set; }
        public string JoinDate { get; set; }
        public string DepartmentName { get; set; }
        public int DepartmentId { get; set; }
        public string DesignationName { get; set; }
        public string ProbationDate { get; set; }
        public string RetirementDate { get; set; }
        public string ContractEndDate { get; set; }
        public int TotalEmp { get; set; }

        public int ReportNameId { get; set; }
    }
}
