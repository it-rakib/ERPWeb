using CrystalDecisions.CrystalReports.Engine;
using System;
using System.Web;

namespace ERP_WEB.Reports
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
            //if (Session["CurrentUser"] != null)
            //{
            //    LoadReport();
            //}
            //else
            //{
            //    Response.Redirect("~//Home//Logoff");
            //}

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
                    if (reportPram.ReportType == "EmployeeProfileReport")
                    {
                        if (reportPram.EmployeeProfile != null)
                        {
                            rd = GenerateEmployeeProfileReportDocument(reportPram);
                        }
                        else
                        {
                            string strRptPath = Server.MapPath("~/") + "Reports//Rpt//" + "_blunk.rpt";
                            rd.Load(strRptPath);
                        }
                    }
                    else if (reportPram.DataSource != null)
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

                    CrystalReportViewer.ReportSource = rd;
                    CrystalReportViewer.RefreshReport();


                    //  rd.ExportToDisk(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat, @"D:\ASD.pdf");

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
                // Setting FromDate 
                string strFromDate = reportPram.FromDate.ToString();
                // Setting ToDate
                string strToDate = reportPram.ToDate.ToString();
                // Setting Report Data Source     
                var rptSource = reportPram.DataSource;


                string strRptPath = Server.MapPath("~/") + "Reports//Rpt//" + strReportName;
                //Loading Report
                rd.Load(strRptPath);
                //Setting Data Source
                rd.SetDataSource(rptSource);
                //rd.Database.Tables[0].SetDataSource(rptSource);

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
        private ReportDocument GenerateEmployeeProfileReportDocument(dynamic reportPram)//Profile report
        {
            var rd = new ReportDocument();
            try
            {
                string strReportName = reportPram.RptFileName;
                // Setting FromDate 
                string strFromDate = reportPram.FromDate.ToString();
                // Setting ToDate
                string strToDate = reportPram.ToDate.ToString();
                // Setting Report Data Source     
                var rptSource1 = reportPram.EmployeeProfile;
                var rptSource2 = reportPram.EducationList;
                var rptSource3 = reportPram.PassportInfos;
                var rptSource4 = reportPram.DrivingLicenses;
                var rptSource5 = reportPram.ChildrenList;
                string strRptPath = Server.MapPath("~/") + "Reports//Rpt//" + strReportName;
                //Loading Report
                rd.Load(strRptPath);
                //Setting Data Source
                //rd.SetDataSource(rptSource);
                rd.Database.Tables[0].SetDataSource(rptSource1);
                rd.Database.Tables[1].SetDataSource(rptSource2);
                rd.Database.Tables[2].SetDataSource(rptSource3);
                rd.Database.Tables[3].SetDataSource(rptSource4);
                rd.Database.Tables[4].SetDataSource(rptSource5);

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
                    case "LeaveReport":
                        {
                            //Please set your reports parameter one by one
                            rd.SetParameterValue("@fromDate", reportPram.FromDate);
                            rd.SetParameterValue("@toDate", reportPram.FromDate);
                            break;
                        }



                }
            }
            catch (Exception)
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