using Entities.Core.User;
using System;
using System.Collections.Generic;

namespace ERP_WEB.Reports.Entity
{
    public class EmpProfileReportParam
    {
        public string RptFileName { get; set; }
        public string ReportTitle { get; set; }
        public string ReportSubTitle { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public string ReportType { get; set; }
        public Int32 CompanyId { get; set; }
        public string CompanyName { get; set; }
        public List<EmployeeProfileInformation> EmployeeProfile { get; set; }
        public List<EmployeeEducationInfo> EducationList { get; set; }
        public List<EmployeePassportInfo> PassportInfos { get; set; }
        public List<EmployeeDrivingLicense> DrivingLicenses { get; set; }
        public List<EmployeeChildrenInfo> ChildrenList { get; set; }
        public bool IsSubReport { get; set; }
        public dynamic SubReportDataSources { get; set; }
        public UserInfo User { get; set; }
        public bool IsPassParamToCr { get; set; }
        public string MachineName { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }

        public int ReportNameId { get; set; }
        public string Parameter { get; set; }
    }
}