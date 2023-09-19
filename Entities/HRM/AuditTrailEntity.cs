using System;

namespace Entities.HRM
{
    public class AuditTrailEntity
    {
        public int AuditId { get; set; }
        public DateTime AuditDate { get; set; }
        public string TaskType { get; set; }
        public string AuditTask { get; set; }
        public string AuditDesc { get; set; }
        public long AuditedEmpId { get; set; }
        public string EmpIds { get; set; }
        public string EmpName { get; set; }
        public string PageUrl { get; set; }
        public string DateFrom { get; set; }
        public string DateTo { get; set; }
        public string UserId { get; set; }
        public string IPAddress { get; set; }
        public string MacAddress { get; set; }
        public string TerminalId { get; set; }
    }
}
