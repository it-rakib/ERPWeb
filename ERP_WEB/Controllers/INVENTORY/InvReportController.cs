using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BLL.INVENTORY.Reports;
using Entities.Core.User;
using Entities.INVENTORY;


namespace ERP_WEB.Controllers.INVENTORY
{
    public class InvReportController : Controller
    {
        readonly IInvReportRepository _invReportRepository = new InvReportService();
        public ActionResult MovementReport()
        {
            if (Session["CurrentUser"] != null)
            {
                return View("../INVENTORY/Reports/Movement/Index");
            }
            return RedirectToAction("Logoff", "Home");
        }

        public void GetMovementReport(CommonParams objCommonParams)
        {
            var user = (UserInfo)Session["CurrentUser"];
            ReportsParams objReportParams = new ReportsParams();
            var res = _invReportRepository.GetMovementReportData(objCommonParams);

            objReportParams.UserId = user.USERID;
            objReportParams.UserName = user.USERNAME;
            objReportParams.EmpId = user.EMPID;
            objReportParams.DataTableSource = res.Tables[0];

            objReportParams.IsPassParamToCr = true;
            objReportParams.ReportTitle = "Movement Report";
            objReportParams.RptPath = "Reports/InvRpt/";
            objReportParams.RptFileName = "rpt_InvMovementReport.rdlc";

            objReportParams.DataSetName = "dsMovementReport";
            objReportParams.ReportMode = "ReportViewer";
            this.HttpContext.Session["ReportType"] = "MovementReport";
            this.HttpContext.Session["ReportParam"] = objReportParams;
        }
    }
}