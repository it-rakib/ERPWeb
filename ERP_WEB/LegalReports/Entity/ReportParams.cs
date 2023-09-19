using System.Collections.Generic;

namespace ERP_WEB.LegalReports.Entity
{
    public class ReportParams<T>
    {
        public string RptFileName { get; set; }
        public string ReportTitle { get; set; }
        public List<T> DataSource { get; set; }
        public bool IsPassParamToCr { get; set; }

        public string ReportType { get; set; }
    }
}