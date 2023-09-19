using AUtilities;
using BLL.LAND.Reports;
using ERP_WEB.LandReports.Entity;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;


namespace ERP_WEB.Controllers.Land
{
    public class LandReportController : Controller
    {
        readonly string prefixed = "../Land/LandReport";

        readonly ILandReportRepository _landReportRepository = new LandReportService();
      

        // GET: Land Report
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }

        //Division Wise report Single

        public void GetDivisionWiseReport(Guid divisionId)
        {
            ReportParams<DivisionWiseReport> objReportParams = new ReportParams<DivisionWiseReport>();
            var ds = _landReportRepository.GetDivisionWiseReport(divisionId);
            var data = ListConversion.ConvertTo<DivisionWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptDivisionWiseReport.rpt";

            this.HttpContext.Session["ReportType"] = "crptDivision";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }
        public void GetDivisionWiseMutationReport(Guid divisionId)
        {
            ReportParams<DivisionWiseReport> objReportParams = new ReportParams<DivisionWiseReport>();
            var ds = _landReportRepository.GetDivisionWiseMutationReport(divisionId);
            var data = ListConversion.ConvertTo<DivisionWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptDivisionWiseMutationReport.rpt";

            this.HttpContext.Session["ReportType"] = "crptDivision";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }
        //District Wise
        public void GetAllDistrictWiseReport()
        {
            ReportParams<DistrictWiseReport> objReportParams = new ReportParams<DistrictWiseReport>();
            var ds = _landReportRepository.GetDistrictWiseReport();
            var data = ListConversion.ConvertTo<DistrictWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptDistrictWiseReport.rpt";

            this.HttpContext.Session["ReportType"] = "crptDistrict";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }

        public void GetSingleDistrictWiseReport(Guid districtId)
        {
            ReportParams<DistrictWiseReport> objReportParams = new ReportParams<DistrictWiseReport>();
            var ds = _landReportRepository.GetDistrictWiseSingleReport(districtId);
            var data = ListConversion.ConvertTo<DistrictWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptSingleDistrictWiseReport.rpt";

            this.HttpContext.Session["ReportType"] = "rptSingleDistrictWiseReport";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }
        public void GetSingleDistrictWiseMutationReport(Guid districtId)
        {
            ReportParams<DistrictWiseReport> objReportParams = new ReportParams<DistrictWiseReport>();
            var ds = _landReportRepository.GetDistrictWiseSingleMutationReport(districtId);
            var data = ListConversion.ConvertTo<DistrictWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptSingleDistrictWiseMutationReport.rpt";

            this.HttpContext.Session["ReportType"] = "rptSingleDistrictWiseMutationReport";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }
        //Upozilla Wise
        public void GetUpozillaWiseReport()
        {
            ReportParams<UpozillaWiseReport> objReportParams = new ReportParams<UpozillaWiseReport>();
            var ds = _landReportRepository.GetUpozillaWiseReport();
            var data = ListConversion.ConvertTo<UpozillaWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "crptUpozila.rpt";

            this.HttpContext.Session["ReportType"] = "crptUpozila";
            this.HttpContext.Session["ReportParam"] = objReportParams;

            //ReportParams<UpozillaWiseReport> objReportParams = new ReportParams<UpozillaWiseReport>();
            //objReportParams.DataSource = GetUpozillaWiseReport();
            //objReportParams.RptFileName = "crptUpozila.rpt";
            //this.HttpContext.Session["ReportType"] = "crptUpozila";
            //this.HttpContext.Session["ReportParam"] = objReportParams;
        }

        public void GetUpozillaWiseMutationReport(Guid upozilaId)
        {
            ReportParams<UpozillaWiseReport> objReportParams = new ReportParams<UpozillaWiseReport>();
            var ds = _landReportRepository.GetUpozillaWiseMutationReport(upozilaId);
            var data = ListConversion.ConvertTo<UpozillaWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "crptUpozilaMutationReport.rpt";

            this.HttpContext.Session["ReportType"] = "crptUpozila";
            this.HttpContext.Session["ReportParam"] = objReportParams;

            //ReportParams<UpozillaWiseReport> objReportParams = new ReportParams<UpozillaWiseReport>();
            //objReportParams.DataSource = GetUpozillaWiseReport();
            //objReportParams.RptFileName = "crptUpozila.rpt";
            //this.HttpContext.Session["ReportType"] = "crptUpozila";
            //this.HttpContext.Session["ReportParam"] = objReportParams;
        }

        public void GetSingleUpozilaWiseReport(Guid upozilaId)
        {
            ReportParams<UpozillaWiseReport> objReportParams = new ReportParams<UpozillaWiseReport>();
            var ds = _landReportRepository.GetUpozillaWiseSingleReport(upozilaId);
            var data = ListConversion.ConvertTo<UpozillaWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptSingleUpozilaWiseReport.rpt";

            this.HttpContext.Session["ReportType"] = "rptSingleUpozilaWiseReport";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }

        //Mouza Wise
        public void GetMouzaWiseReport()
        {
            ReportParams<MouzaWiseReport> objReportParams = new ReportParams<MouzaWiseReport>();
            var ds = _landReportRepository.GetMouzaWiseReport();
            var data = ListConversion.ConvertTo<MouzaWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "crptMouza.rpt";

            this.HttpContext.Session["ReportType"] = "crptMouza";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }

        public void GetSingleMouzaWiseReport(Guid mouzaId)
        {
            ReportParams<MouzaWiseReport> objReportParams = new ReportParams<MouzaWiseReport>();
            var ds = _landReportRepository.GetMouzaWiseSingleReport(mouzaId);
            var data = ListConversion.ConvertTo<MouzaWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptSingleMouzaWiseReport.rpt";

            this.HttpContext.Session["ReportType"] = "rptSingleMouzaWiseReport";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }

        //Owner Wise
        public void GetOwnerWiseReport()
        {
            ReportParams<OwnerWiseReport> objReportParams = new ReportParams<OwnerWiseReport>();
            var ds = _landReportRepository.GetOwnerWiseReport();
            var data = ListConversion.ConvertTo<OwnerWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "crptOwner.rpt";

            this.HttpContext.Session["ReportType"] = "crptOwner";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }
        public void GetSingleOwnerWiseReport(Guid mouzaId,Guid ownerInfoId)
        {
            ReportParams<OwnerWiseReport> objReportParams = new ReportParams<OwnerWiseReport>();
            var ds = _landReportRepository.GetOwnerWiseSingleReport(mouzaId,ownerInfoId);
            var data = ListConversion.ConvertTo<OwnerWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptSingleOwnerWiseReport.rpt";

            this.HttpContext.Session["ReportType"] = "rptSingleOwnerWiseReport";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }

        public void GetSingleOwnerWiseSummaryReport(Guid ownerInfoId)
        {
            ReportParams<OwnerWiseReport> objReportParams = new ReportParams<OwnerWiseReport>();
            var ds = _landReportRepository.GetOwnerWiseSingleSummaryReport(ownerInfoId);
            var data = ListConversion.ConvertTo<OwnerWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptSingleOwnerWiseSummaryReport.rpt";

            this.HttpContext.Session["ReportType"] = "rptSingleOwnerWiseReport";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }

        public void GetSingleOwnerWiseMutationReport(Guid mouzaId, Guid ownerInfoId)
        {
            ReportParams<OwnerWiseReport> objReportParams = new ReportParams<OwnerWiseReport>();
            var ds = _landReportRepository.GetOwnerWiseMutationReport(mouzaId, ownerInfoId);
            var data = ListConversion.ConvertTo<OwnerWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptSingleOwnerWiseMutationReport.rpt";

            this.HttpContext.Session["ReportType"] = "rptSingleOwnerWiseReport";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }

        public void GetSingleOwnerWiseMutationSummaryReport(Guid ownerInfoId)
        {
            ReportParams<OwnerWiseReport> objReportParams = new ReportParams<OwnerWiseReport>();
            var ds = _landReportRepository.GetSingleOwnerWiseMutationSummaryReport(ownerInfoId);
            var data = ListConversion.ConvertTo<OwnerWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptSingleOwnerWiseMutationSummaryReport.rpt";

            this.HttpContext.Session["ReportType"] = "rptSingleOwnerWiseReport";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }

        //File Wise

        public void GetFileWiseReport()
        {
            ReportParams<FileWiseReport> objReportParams = new ReportParams<FileWiseReport>();
            var ds = _landReportRepository.GetFileWiseReport();
            var data = ListConversion.ConvertTo<FileWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "crptFile.rpt";

            this.HttpContext.Session["ReportType"] = "crptFile";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }

        public void GetMouzaWiseMutationReport(Guid mouzaId)
        {
            ReportParams<MouzaWiseReport> objReportParams = new ReportParams<MouzaWiseReport>();
            var ds = _landReportRepository.GetMouzaWiseMutationReport(mouzaId);
            var data = ListConversion.ConvertTo<MouzaWiseReport>(ds.Tables[0]).ToList();
            objReportParams.DataSource = data;
            objReportParams.RptFileName = "rptSingleMouzaWiseMutationReport.rpt";

            this.HttpContext.Session["ReportType"] = "rptSingleMouzaWiseReport";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }
    }
}