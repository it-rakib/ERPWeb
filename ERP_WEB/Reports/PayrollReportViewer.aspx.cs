using CrystalDecisions.CrystalReports.Engine;
using System;
using System.Configuration;
using System.Data.SqlClient;
using System.Web;

namespace ERP_WEB.Reports
{
    public partial class PayrollReportViewer : System.Web.UI.Page
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
                    Page.Title = "HRMIS | " + reportPram.ReportTitle;
                    reportPram.ReportType = reportType;

                    // Setting report data source

                    if (reportPram.ReportType == "SalarySheetReport")
                    {
                        rd = GenerateSalarySheetReportDocument(reportPram);
                    }
                    else if (reportPram.ReportType == "EmployeeProfileFactory")
                    {
                        rd = GenerateSalarySheetReportDocument(reportPram);
                    }

                    // rd.SetDatabaseLogon("softadmin", "w23eW@#E");
                    String ConStr = ConfigurationManager.ConnectionStrings["SqlConnectionStringHRM"].ConnectionString;
                    SqlConnectionStringBuilder Builder = new SqlConnectionStringBuilder(ConStr);
                    rd.SetDatabaseLogon(Builder.UserID, Builder.Password);

                    CrystalReportViewer.ReportSource = rd;


                    // CrystalReportViewer.RefreshReport();
                    //rd.Close();
                    //rd.Dispose();
                    //GC.Collect();
                    //GC.WaitForPendingFinalizers();
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
        private ReportDocument GenerateSalarySheetReportDocument(dynamic reportPram)
        {
            var rd = new ReportDocument();
            try
            {
                string strReportName = reportPram.RptFileName;
                string strRptPath = Server.MapPath("~/") + "Reports//Rpt//" + strReportName;
                rd.Load(strRptPath);
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
                    case "SalarySheetReport":
                        {
                            rd.SetParameterValue("prm", reportPram.Parameter);
                            break;
                        }
                    case "AllowanceReport":
                        {
                            rd.SetParameterValue("prm", reportPram.Parameter);
                            break;
                        }
                    case "ArearReport":
                        {
                            rd.SetParameterValue("prm", reportPram.Parameter);
                            // rd.SetParameterValue("prm2", reportPram.Parameter2);
                            break;
                        }
                    case "EmployeeProfileFactory":
                        {
                            //Please set your reports parameter one by one
                            rd.SetParameterValue("emp_no", reportPram.Parameter);
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