using System;

namespace ERP_WEB.Reports.Entity
{
    public class EmployeePassportInfo
    {
        public long EmpID { get; set; }
        public string PassportNo { get; set; }
        public DateTime PIssueDate { get; set; }
        public DateTime PExpireDate { get; set; }
        public int PAuthorityCountryID { get; set; }
        public string CountryName { get; set; }
    }
}