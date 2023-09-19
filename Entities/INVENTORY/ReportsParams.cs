using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entities.Core.User;

namespace Entities.INVENTORY
{
    public class ReportsParams<T>
    {
        public string RptFileName { get; set; }
        public string ReportTitle { get; set; }
        public string ReportSubTitle { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string ReportType { get; set; }

        public List<T> DataSource { get; set; }
        public DataSet DataSetSource { get; set; }
        public DataTable DataTableSource { get; set; }

        public bool IsSubReport { get; set; }
        public dynamic SubReportDataSources { get; set; }

        public UserInfo User { get; set; }
        public bool IsPassParamToCr { get; set; }
        public string DataSetName { get; set; }
        public string MachineName { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
        public bool IsNullDataSource { get; set; }
        public string ReportMode { get; set; }
    }
    public class ReportsParams
    {
        public string RptFileName { get; set; }
        public string RptPath { get; set; }
        public string ReportTitle { get; set; }
        public string ReportSubTitle { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public DateTime Date { get; set; }
        public string Date1 { get; set; }
        public DateTime MonthYear { get; set; }
        public string Status { get; set; }
        public string ReportType { get; set; }
        public Int32 CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string DesignationName { get; set; }
        public DataSet DataSetSource { get; set; }
        public DataTable DataTableSource { get; set; }
        public bool IsSubReport { get; set; }
        public dynamic SubReportDataSources { get; set; }
        public UserInfo User { get; set; }
        public bool IsPassParamToCr { get; set; }
        public string DataSetName { get; set; }
        public string DataSetName2 { get; set; }
        public string MachineName { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
        public string EmpId { get; set; }//for user emp id
        public string ReportEmpId { get; set; }//for report data
        public bool IsNullDataSource { get; set; }

        public string ReportMode { get; set; }
        public string AttStatus { get; set; }
        public string TypeName { get; set; }

        public string Parameter { get; set; }
        public string Parameter2 { get; set; }
        public DateTime DateTo { get; set; }

        public string AcceptByName { get; set; }
        public string AcceptByDesignation { get; set; }

        public int UnitId { get; set; }
    }
}
