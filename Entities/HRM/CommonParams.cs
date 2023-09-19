using System;
using System.Collections.Generic;

namespace Entities.HRM
{
    public class CommonParams
    {
        public List<int> CompanyTypeIds { get; set; }
        public List<int> CompanyIds { get; set; }
        public List<int> UnitIds { get; set; }
        public List<int> DepartmentIds { get; set; }
        public List<int> SectionIds { get; set; }
        public List<int> WingIds { get; set; }
        public List<int> TeamIds { get; set; }
        public List<int> DesignationIds { get; set; }
        public List<int> JobLocationIds { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string ServerName { get; set; }
        public string DbName { get; set; }
        public string EmpId { get; set; }
        public string EmpCode { get; set; }
        public DateTime MonthYear { get; set; }
        public DateTime MonthYearTo { get; set; }
        public DateTime Date { get; set; }
        public DateTime DateTo { get; set; }
        public List<string> AttStatus { get; set; }
        public string AttStatus1 { get; set; }
        public int DepartmentId { get; set; }
        public int DesignationId { get; set; }
        public string DesignationName { get; set; }
        public int EmpStatusId { get; set; }
        public string EmpStatusName { get; set; }
        public int ReportNameId { get; set; }
        public int PaymentMode { get; set; }
        public string ActionDate { get; set; }
        public List<string> ActionDates { get; set; }
        public DateTime BonusEffectDate { get; set; }
        public List<string> PaymentModes { get; set; }
        public int DateType { get; set; }
        public int ReportType { get; set; }

        public int IsDashBoard { get; set; }
        public int EmpTypeId { get; set; }
        public List<string> EmpTypeIds { get; set; }

        public int ActionStatus { get; set; }
        public int JobLocationId { get; set; }

        public int AcceptById { get; set; }

        public string SectionType { get; set; }
        public int DesigTypeId { get; set; }
        public int LeaveYear { get; set; }
        public int IncrementTypeId { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

    }
}
