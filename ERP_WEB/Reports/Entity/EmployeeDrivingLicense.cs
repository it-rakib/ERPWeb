using System;

namespace ERP_WEB.Reports.Entity
{
    public class EmployeeDrivingLicense
    {
        public long EmpID { get; set; }
        public string DrivingLicense { get; set; }
        public DateTime DIssueDate { get; set; }
        public DateTime DExpireDate { get; set; }
        public string CountryName { get; set; }
    }
}