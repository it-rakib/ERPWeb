using Microsoft.Reporting.WebForms;
using System;
using System.Data;
using System.Web;

namespace ERP_WEB.Reports
{
    public partial class ReportViewerRDLC : System.Web.UI.Page
    {
        private System.Data.DataSet ds, ds1;
        private DataTable dt1;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                if (Session["CurrentUser"] != null)
                {
                    LoadReport();
                }
                else
                {
                    Response.Redirect("~//Home//Logoff");
                }
            }

        }
        private void LoadReport()
        {
            var reportType = HttpContext.Current.Session["ReportType"].ToString();
            var reportPram = (dynamic)HttpContext.Current.Session["ReportParam"];

            bool isValid = true;
            if (reportPram != null && string.IsNullOrEmpty(reportPram.RptFileName)) // Checking is Report name provided or not
            {
                isValid = false;
            }

            if (isValid) // If Report Name provided then do other operation
            {
                Page.Title = "HRMIS | " + reportPram.ReportTitle;

                var dt = new DataTable();
                reportPram.ReportType = reportType;
                dt = reportPram.DataTableSource;
                ds = reportPram.DataSetSource;
                bool isnulldata = reportPram.IsNullDataSource;
                if (reportPram.DataTableSource != null || isnulldata)
                {
                    if (!isnulldata && dt.Rows.Count <= 0)
                    {
                        ShowErrorMessage();
                    }
                    else
                    {
                        GenerateReportDocument(reportPram, reportType, dt);
                    }
                }
                else if (reportPram.DataSetSource != null)
                {
                    if (ds.Tables[0].Rows.Count <= 0)
                    {
                        ShowErrorMessage();
                    }
                    else
                    {
                        GenerateReportDocument2(reportPram, reportType, ds);
                    }
                }
                else
                {
                    ShowErrorMessage();
                }
            }
        }


        private void ShowErrorMessage()
        {
            //string rptPath = "rpt_blank.rdlc";
            rdlcReportViewer.LocalReport.DataSources.Clear();
            rdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource("", new DataTable()));
            rdlcReportViewer.LocalReport.ReportPath = Server.MapPath("~/") + "Reports//Rpt//rpt_blank.rdlc";

            //-to show message in report viewer
            rdlcReportViewer.DataBind();
            rdlcReportViewer.LocalReport.Refresh();


            //-to show message in pdf viewer
            //var bytes = rdlcReportViewer.LocalReport.Render("PDF");
            //Response.Buffer = true;
            //Response.ContentType = "application/pdf";
            //Response.AddHeader("content-disposition", "inline;attachment; filename=Sample.pdf");
            //Response.BinaryWrite(bytes);
            //Response.Flush();
            //Response.Clear();
        }

        private void GenerateReportDocument(dynamic reportPram, string reportType, DataTable data)
        {
            ReportParameter[] rptParams = new ReportParameter[0];


            if (reportPram.IsPassParamToCr)
            {
                rptParams = ReportParameters(reportPram, reportType, rptParams);
            }

            string dsName = reportPram.DataSetName;
            rdlcReportViewer.LocalReport.DataSources.Clear();
            rdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource(dsName, data));

            if (reportType == "EmployeeJobCardReport" && data.Rows.Count == 1)
            {
                rdlcReportViewer.LocalReport.DisplayName = "Job_Card_Report_" + data.Rows[0]["EmpName"] + "_" +
                                                           data.Rows[0]["EmpCode"];
            }
            else
            {
                rdlcReportViewer.LocalReport.DisplayName = reportType;
            }

            rdlcReportViewer.LocalReport.ReportPath = Server.MapPath("~/") + "Reports//Rpt//" + reportPram.RptFileName;

            //Setting Parameter Value
            if (reportPram.IsPassParamToCr)
            {
                rdlcReportViewer.LocalReport.SetParameters(rptParams); //Add Parameter in Report
            }


            rdlcReportViewer.DataBind();
            rdlcReportViewer.LocalReport.Refresh();
            // rdlcReportViewer.ZoomPercent = 120;

            //for pdf

            //var bytes = rptViewer.LocalReport.Render("PDF");
            //Response.Buffer = true;
            //Response.ContentType = "application/pdf";
            //Response.AddHeader("content-disposition", "inline;attachment; filename=Sample.pdf");
            //Response.BinaryWrite(bytes);
            //Response.Flush(); // send it to the client to download
            //Response.Clear();
        }
        private void GenerateReportDocument2(dynamic reportPram, string reportType, DataSet data)
        {
            ReportParameter[] rptParams = new ReportParameter[0];

            if (reportPram.IsPassParamToCr)
            {
                rptParams = ReportParameters(reportPram, reportType, rptParams);
            }
            string dsName1 = reportPram.DataSetName;
            string dsName2 = reportPram.DataSetName2;
            rdlcReportViewer.LocalReport.DataSources.Clear();
            rdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource(dsName1, data.Tables[0]));
            rdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource(dsName2, data.Tables[1]));

            rdlcReportViewer.LocalReport.DisplayName = reportType;

            rdlcReportViewer.LocalReport.ReportPath = Server.MapPath("~/") + "Reports//Rpt//" + reportPram.RptFileName;

            //Setting Parameter Value
            if (reportPram.IsPassParamToCr)
            {
                rdlcReportViewer.LocalReport.SetParameters(rptParams); //Add Parameter in Report
            }

            rdlcReportViewer.DataBind();
            rdlcReportViewer.LocalReport.Refresh();
            // rdlcReportViewer.ZoomPercent = 120;

            //for pdf

            //var bytes = rptViewer.LocalReport.Render("PDF");
            //Response.Buffer = true;
            //Response.ContentType = "application/pdf";
            //Response.AddHeader("content-disposition", "inline;attachment; filename=Sample.pdf");
            //Response.BinaryWrite(bytes);
            //Response.Flush(); // send it to the client to download
            //Response.Clear();
        }

        private static ReportParameter[] ReportParameters(dynamic reportPram, string reportType, ReportParameter[] rptParams)
        {

            if (reportType == "MonthlyAttendanceSummaryReport")
            {
                rptParams = new ReportParameter[3];
                rptParams[0] = new ReportParameter("rpMachineName", reportPram.MachineName);
                rptParams[1] = new ReportParameter("rpUserName", reportPram.UserName);
                rptParams[2] = new ReportParameter("rpMonthYear", reportPram.MonthYear.ToString("MMMM-yyyy"));
            }
            else if (reportType == "DeptWiseAttendanceSummaryReport")
            {
                rptParams = new ReportParameter[3];
                rptParams[0] = new ReportParameter("rpMachineName", reportPram.MachineName);
                rptParams[1] = new ReportParameter("rpUserName", reportPram.UserName);
                rptParams[2] = new ReportParameter("rpDate", reportPram.Date.ToString("dd-MMM-yyyy"));

            }
            else if (reportType == "DailyAttDetailsReport")
            {
                rptParams = new ReportParameter[5];
                rptParams[0] = new ReportParameter("rpMachineName", reportPram.MachineName);
                rptParams[1] = new ReportParameter("rpUserName", reportPram.UserName);
                rptParams[2] = new ReportParameter("rpDate", reportPram.Date.ToString("dd-MMM-yyyy"));
                rptParams[3] = new ReportParameter("rpDateTo", reportPram.DateTo.ToString("dd-MMM-yyyy"));
                rptParams[4] = new ReportParameter("rpAttStatus", reportPram.AttStatus);

            }
            else if (reportType == "LeaveRegisterReport")
            {
                rptParams = new ReportParameter[4];
                rptParams[0] = new ReportParameter("rpMachineName", reportPram.MachineName);
                rptParams[1] = new ReportParameter("rpUserName", reportPram.UserName);
                rptParams[2] = new ReportParameter("rpFromDate", reportPram.FromDate.ToString("dd-MMM-yyyy"));
                rptParams[3] = new ReportParameter("rpToDate", reportPram.ToDate.ToString("dd-MMM-yyyy"));
            }
            else if (reportType == "DesigWiseAttendanceSummaryReport")
            {
                rptParams = new ReportParameter[4];
                rptParams[0] = new ReportParameter("rpMachineName", reportPram.MachineName);
                rptParams[1] = new ReportParameter("rpUserName", reportPram.UserName);
                rptParams[2] = new ReportParameter("rpDesignation", reportPram.DesignationName);
                rptParams[3] = new ReportParameter("rpDate", reportPram.Date.ToString("dd-MMM-yyyy"));
            }
            else if (reportType == "DesigWiseAttendanceSummaryReport2")
            {
                rptParams = new ReportParameter[4];
                rptParams[0] = new ReportParameter("rpMachineName", reportPram.MachineName);
                rptParams[1] = new ReportParameter("rpUserName", reportPram.UserName);
                rptParams[2] = new ReportParameter("rpFromDate", reportPram.FromDate.ToString("dd-MMM-yyyy"));
                rptParams[3] = new ReportParameter("rpToDate", reportPram.ToDate.ToString("dd-MMM-yyyy"));
            }

            else if (reportType == "NewJoinerEmployeeReport")
            {
                rptParams = new ReportParameter[5];
                rptParams[0] = new ReportParameter("rpMachineName", reportPram.MachineName);
                rptParams[1] = new ReportParameter("rpUserName", reportPram.UserName);
                rptParams[2] = new ReportParameter("rpFromDate", reportPram.FromDate.ToString("dd-MMM-yyyy"));
                rptParams[3] = new ReportParameter("rpToDate", reportPram.ToDate.ToString("dd-MMM-yyyy"));
                rptParams[4] = new ReportParameter("rpEmpId", reportPram.EmpId);
            }
            else if (reportType == "SeperatedEmployeeReport")
            {
                rptParams = new ReportParameter[6];
                rptParams[0] = new ReportParameter("rpMachineName", reportPram.MachineName);
                rptParams[1] = new ReportParameter("rpUserName", reportPram.UserName);
                rptParams[2] = new ReportParameter("rpFromDate", reportPram.FromDate.ToString("dd-MMM-yyyy"));
                rptParams[3] = new ReportParameter("rpToDate", reportPram.ToDate.ToString("dd-MMM-yyyy"));
                rptParams[4] = new ReportParameter("rpEmpId", reportPram.EmpId);
                rptParams[5] = new ReportParameter("rpTypeName", reportPram.TypeName);
            }
            else if (reportType == "EmployeeJobCardReport")
            {
                rptParams = new ReportParameter[2];
                rptParams[0] = new ReportParameter("rpMachineName", reportPram.MachineName);
                rptParams[1] = new ReportParameter("rpUserName", reportPram.UserName);
            }
            else if (reportType == "ContAbsentEmpReport" || reportType == "LeaveApprovalReport" || reportType == "LeaveHistoryReport")
            {
                rptParams = new ReportParameter[5];
                rptParams[0] = new ReportParameter("rpMachineName", reportPram.MachineName);
                rptParams[1] = new ReportParameter("rpUserName", reportPram.UserName);
                rptParams[2] = new ReportParameter("rpEmpId", reportPram.EmpId);
                rptParams[3] = new ReportParameter("rpFromDate", reportPram.FromDate.ToString("dd-MMM-yyyy"));
                rptParams[4] = new ReportParameter("rpToDate", reportPram.ToDate.ToString("dd-MMM-yyyy"));
            }
            else if (reportType == "EmployeeLetter")
            {
                rptParams = new ReportParameter[1];
                rptParams[0] = new ReportParameter("rpPrintDate", reportPram.Date1);
            }
            else if (reportType == "EmployeeResigAccptLetter")
            {
                rptParams = new ReportParameter[3];
                rptParams[0] = new ReportParameter("rpPrintDate", reportPram.Date1);
                rptParams[1] = new ReportParameter("rpAcceptByName", reportPram.AcceptByName);
                rptParams[2] = new ReportParameter("rpAcceptByDesignation", reportPram.AcceptByDesignation);
            }
            else if (reportType == "OperationSummaryReport")
            {
                rptParams = new ReportParameter[4];
                rptParams[0] = new ReportParameter("rpMachineName", reportPram.MachineName);
                rptParams[1] = new ReportParameter("rpUserName", reportPram.UserName);
                rptParams[2] = new ReportParameter("rpEmpId", reportPram.EmpId);
                rptParams[3] = new ReportParameter("rpFromDate", reportPram.FromDate.ToString("dd-MMM-yyyy"));
            }
            else if (reportType == "OperationCostReport")
            {
                rptParams = new ReportParameter[5];
                rptParams[0] = new ReportParameter("rpMachineName", reportPram.MachineName);
                rptParams[1] = new ReportParameter("rpUserName", reportPram.UserName);
                rptParams[2] = new ReportParameter("rpEmpId", reportPram.EmpId);
                rptParams[3] = new ReportParameter("rpFromDate", reportPram.FromDate.ToString("dd-MMM-yyyy"));
                rptParams[4] = new ReportParameter("rpToDate", reportPram.ToDate.ToString("dd-MMM-yyyy"));
            }
            else
            {
                rptParams = new ReportParameter[3];
                rptParams[0] = new ReportParameter("rpMachineName", reportPram.MachineName);
                rptParams[1] = new ReportParameter("rpUserName", reportPram.UserName);
                rptParams[2] = new ReportParameter("rpEmpId", reportPram.EmpId);
            }

            return rptParams;
        }
    }
}