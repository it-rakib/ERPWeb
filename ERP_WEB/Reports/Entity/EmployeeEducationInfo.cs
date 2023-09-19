namespace ERP_WEB.Reports.Entity
{
    public class EmployeeEducationInfo
    {
        public long EmpID { get; set; }
        public int PassingYear { get; set; }
        public string Institute { get; set; }
        public string Result { get; set; }
        public string OutOf { get; set; }

        public string BoardName { get; set; }
        public string DegreeName { get; set; }

    }
}