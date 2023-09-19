using CrystalDecisions.CrystalReports.Engine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ERP_WEB.LandReports
{
    public partial class ReportViewer : System.Web.UI.Page
    {
        ReportDocument rd = new ReportDocument();
        protected void Page_Init(object sender, EventArgs e)
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
        protected void Page_Load(object sender, EventArgs e)
        {
            //for paging report move this in to Page_Init
        }
        private void LoadReport()
        {
            try
            {
                bool isValid = true;
                var reportType = HttpContext.Current.Session["ReportType"].ToString();
                var reportPram = (dynamic)HttpContext.Current.Session["ReportParam"];
                if (reportPram != null && string.IsNullOrEmpty(reportPram.RptFileName)) // Checking is Report name provided or not
                {
                    isValid = false;
                }
                if (isValid) // If Report Name provided then do other operation
                {
                    Page.Title = "LAND | " + reportPram.ReportTitle;

                    reportPram.ReportType = reportType;

                    // Setting report data source
                     if (reportPram.DataSource != null)
                    {
                        if (reportPram.DataSource.Count > 0)
                        {
                            rd = GenerateReportDocument(reportPram);
                        }
                        else
                        {
                            string strRptPath = Server.MapPath("~/") + "Reports//Rpt//" + "_blunk.rpt";
                            //Loading Report
                            rd.Load(strRptPath);
                        }
                    }
                    else
                    {
                        string strRptPath = Server.MapPath("~/") + "Reports//Rpt//" + "_blunk.rpt";
                        //Loading Report
                        rd.Load(strRptPath);
                    }

                    CrystalReportViewer1.ReportSource = rd;
                    CrystalReportViewer1.RefreshReport();

                }
                else
                {
                    Response.Write("<H2>Nothing Found; No Report name found</H2>");
                }
            }
            catch (Exception ex)
            {
                Response.Write(ex.ToString());
            }
        }
        private ReportDocument GenerateReportDocument(dynamic reportPram)
        {
            var rd = new ReportDocument();
            try
            {
                string strReportName = reportPram.RptFileName;
               
                // Setting Report Data Source     
                var rptSource = reportPram.DataSource;


                string strRptPath = Server.MapPath("~") + "LandReports//Reports//" + reportPram.RptFileName;
                //Loading Report
                rd.Load(strRptPath);
                //Setting Data Source
                rd.SetDataSource(rptSource);

                //Setting Parameter Value
                if (reportPram.IsPassParamToCr)
                {
                    return SetReportParameters(rd, reportPram);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return rd;
        }

        private ReportDocument SetReportParameters(ReportDocument rd, dynamic reportPram)
        {
            try
            {
                var reportType = (string)reportPram.ReportType;
                switch (reportType)
                {
                    case "AttMovementReport":
                        {
                            rd.SetParameterValue("empid", reportPram.ReportEmpId.ToString());
                            rd.SetParameterValue("fromdate", reportPram.FromDate.ToString("dd-MMM-yyyy"));
                            rd.SetParameterValue("tilldate", reportPram.ToDate.ToString("dd-MMM-yyyy"));
                            break;
                        }

                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return rd;
        }

        private void Page_Unload(object sender, System.EventArgs e)
        {
            rd.Close();
            rd.Dispose();
            GC.Collect();
            GC.WaitForPendingFinalizers();
        }
    }
}