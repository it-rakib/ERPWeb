using Microsoft.Reporting.WebForms;
using System;
using System.Data;
using System.Web;

namespace ERP_WEB.Reports
{
    public partial class ReportViewerRDLC_Common : System.Web.UI.Page
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
                Page.Title = "ERP | " + reportPram.ReportTitle;

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
            rdlcReportViewerCommon.LocalReport.DataSources.Clear();
            rdlcReportViewerCommon.LocalReport.DataSources.Add(new ReportDataSource("", new DataTable()));
            rdlcReportViewerCommon.LocalReport.ReportPath = Server.MapPath("~/") + "Reports//Rpt//rpt_blank.rdlc";

            //-to show message in report viewer
            rdlcReportViewerCommon.DataBind();
            rdlcReportViewerCommon.LocalReport.Refresh();


            //-to show message in pdf viewer
            //var bytes = rdlcReportViewerCommon.LocalReport.Render("PDF");
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
            rdlcReportViewerCommon.LocalReport.DataSources.Clear();
            rdlcReportViewerCommon.LocalReport.DataSources.Add(new ReportDataSource(dsName, data));

            if (reportType == "EmployeeJobCardReport" && data.Rows.Count == 1)
            {
                rdlcReportViewerCommon.LocalReport.DisplayName = "Job_Card_Report_" + data.Rows[0]["EmpName"] + "_" +
                                                           data.Rows[0]["EmpCode"];
            }
            else
            {
                rdlcReportViewerCommon.LocalReport.DisplayName = reportType;
            }

            rdlcReportViewerCommon.LocalReport.ReportPath = Server.MapPath("~/") + reportPram.RptPath + reportPram.RptFileName;

            //Setting Parameter Value
            if (reportPram.IsPassParamToCr)
            {
                rdlcReportViewerCommon.LocalReport.SetParameters(rptParams); //Add Parameter in Report
            }


            rdlcReportViewerCommon.DataBind();
            rdlcReportViewerCommon.LocalReport.Refresh();
            // rdlcReportViewerCommon.ZoomPercent = 120;

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
            rdlcReportViewerCommon.LocalReport.DataSources.Clear();
            rdlcReportViewerCommon.LocalReport.DataSources.Add(new ReportDataSource(dsName1, data.Tables[0]));
            rdlcReportViewerCommon.LocalReport.DataSources.Add(new ReportDataSource(dsName2, data.Tables[1]));

            rdlcReportViewerCommon.LocalReport.DisplayName = reportType;

            rdlcReportViewerCommon.LocalReport.ReportPath = Server.MapPath("~/") + reportPram.RptPath + reportPram.RptFileName;

            //Setting Parameter Value
            if (reportPram.IsPassParamToCr)
            {
                rdlcReportViewerCommon.LocalReport.SetParameters(rptParams); //Add Parameter in Report
            }

            rdlcReportViewerCommon.DataBind();
            rdlcReportViewerCommon.LocalReport.Refresh();
            // rdlcReportViewerCommon.ZoomPercent = 120;

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
            if (reportType == "MovementReport")
            {
                rptParams = new ReportParameter[2];
                rptParams[0] = new ReportParameter("rpUserName", reportPram.UserName);
                rptParams[1] = new ReportParameter("rpEmpId", reportPram.EmpId);
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