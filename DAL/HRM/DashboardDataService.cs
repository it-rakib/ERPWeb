using DAL.Common;
using Entities.HRM;
using Entities.HRM.DTO;
using Entities.HRM.GraphReport;
using System.Collections.Generic;
using System.Linq;


namespace DAL.HRM
{
    public class DashboardDataService
    {
        readonly CommonDataServiceHRM _common = new CommonDataServiceHRM();

        public Dashboard_EmployeeStatus GetEmployeeStatusReportData(int jobLocationId, string companyIds, string unitIds, string deptIds)
        {
            string jobLocId = "";
            jobLocId = jobLocationId.ToString();
            if (jobLocationId == 0)
            {
                jobLocId = "%";
            }

            return _common.Select_Data_Object<Dashboard_EmployeeStatus>("sp_Select_Dashboard", "Get_Employee_Status_Summary", jobLocId, companyIds, unitIds, deptIds);
        }

        public List<Dashboard_EmpPresentStatus> GetEmployeePresentStatusData(int jobLocationId, string companyIds, string unitIds, string deptIds)
        {
            string jobLocId = "";
            jobLocId = jobLocationId.ToString();
            if (jobLocationId == 0)
            {
                jobLocId = "%";
            }

            return _common.Select_Data_List<Dashboard_EmpPresentStatus>("sp_Select_Dashboard", "Get_Employee_Present_Status", jobLocId, companyIds, unitIds, deptIds);
        }
        public List<Dashboard_LeaveStatus> GetLeaveStatusMonthlWiseReportData()
        {
            return _common.Select_Data_List<Dashboard_LeaveStatus>("sp_Select_Dashboard", "Get_Employee_LeaveStatus_MonthWise");
        }

        public Dashboard_EmployeeStatus GetEmployeeAttendaceCount(int jobLocationId, string companyIds, string unitIds, string deptIds)
        {
            string jobLocId = "";
            jobLocId = jobLocationId.ToString();
            if (jobLocationId == 0)
            {
                jobLocId = "%";
            }
            return _common.Select_Data_List<Dashboard_EmployeeStatus>("sp_Select_Dashboard", "Get_Employee_Attendance_Count", jobLocId, companyIds, unitIds, deptIds).SingleOrDefault();
        }

        public List<Dashboard_LeaveStatus> GetLeaveStatusDepartmentWiseData(int jobLocationId, string companyIds, string unitIds, string deptIds)
        {
            string jobLocId = "";
            jobLocId = jobLocationId.ToString();
            if (jobLocationId == 0)
            {
                jobLocId = "%";
            }
            return _common.Select_Data_List<Dashboard_LeaveStatus>("sp_Select_Dashboard", "Get_Employee_OnLeave_DeptWise", jobLocId, companyIds, unitIds, deptIds);
        }
        public List<Dashboard_NewJoinEmployee> GetNewJoinEmployeeReportData(int jobLocationId, string companyIds, string unitIds, string deptIds)
        {
            string jobLocId = "";
            jobLocId = jobLocationId.ToString();
            if (jobLocationId == 0)
            {
                jobLocId = "%";
            }
            return _common.Select_Data_List<Dashboard_NewJoinEmployee>("sp_Select_Dashboard", "Get_New_Join_EmployeeList", jobLocId, companyIds, unitIds, deptIds);
        }
        public List<Dashboard_NewJoinEmployee> GetNewJoinEmpDeptWiseGraphData(int jobLocationId, string companyIds, string unitIds, string deptIds)
        {
            string jobLocId = "";
            jobLocId = jobLocationId.ToString();
            if (jobLocationId == 0)
            {
                jobLocId = "%";
            }
            return _common.Select_Data_List<Dashboard_NewJoinEmployee>("sp_Select_Dashboard", "Get_New_Join_Employee_DeptWise", jobLocId, companyIds, unitIds, deptIds);
        }

        public List<DegreeWiseEmpInfo> GetDegreeWiseEmpReportData()
        {
            return _common.Select_Data_List<DegreeWiseEmpInfo>("sp_Select_Dashboard", "Get_DegreeWise_Emp_ReportData");
        }



        public List<Dashboard_EmpAttStatus> GetEmpAttendanceStatusData(int jobLocationId, string companyIds, string unitIds, string deptIds)
        {
            string jobLocId = "";
            jobLocId = jobLocationId.ToString();
            if (jobLocationId == 0)
            {
                jobLocId = "%";
            }
            return _common.Select_Data_List<Dashboard_EmpAttStatus>("sp_Select_Dashboard", "Get_Employee_Attendance_Status", jobLocId, companyIds, unitIds, deptIds);
        }

        public List<Dashboard_EmpPresentStatus> GetDeptWiseAttendanceStatusData(int jobLocationId, string companyIds, string unitIds, string deptIds)
        {
            string jobLocId = "";
            jobLocId = jobLocationId.ToString();
            if (jobLocationId == 0)
            {
                jobLocId = "%";
            }
            return _common.Select_Data_List<Dashboard_EmpPresentStatus>("sp_Select_Dashboard", "Get_Department_Wise_Attendance_Status", jobLocId, companyIds, unitIds, deptIds);
        }

        public List<EmployeeReportEntity> GetUpcomingConfirmEmployeeList(int jobLocationId, string companyIds, string unitIds, string deptIds)
        {
            string jobLocId = "";
            jobLocId = jobLocationId.ToString();
            if (jobLocationId == 0)
            {
                jobLocId = "%";
            }
            return _common.Select_Data_List<EmployeeReportEntity>("sp_Select_Dashboard", "Get_Upcoming_Confirmation_EmployeeList", jobLocId, companyIds, unitIds, deptIds);

        }

        public List<EmployeeReportEntity> GetUpcomingRetirementEmployeeList(int jobLocationId, string companyIds, string unitIds, string deptIds)
        {
            string jobLocId = "";
            jobLocId = jobLocationId.ToString();
            if (jobLocationId == 0)
            {
                jobLocId = "%";
            }
            return _common.Select_Data_List<EmployeeReportEntity>("sp_Select_Dashboard", "Get_Upcoming_Retirement_EmployeeList", jobLocId, companyIds, unitIds, deptIds);

        }

        public List<EmployeeReportEntity> GetUpcomingContractEndEmployeeList(int jobLocationId, string companyIds, string unitIds, string deptIds)
        {
            string jobLocId = "";
            jobLocId = jobLocationId.ToString();
            if (jobLocationId == 0)
            {
                jobLocId = "%";
            }
            return _common.Select_Data_List<EmployeeReportEntity>("sp_Select_Dashboard", "Get_Upcoming_ContractEnd_EmployeeList", jobLocId, companyIds, unitIds, deptIds);

        }
    }
}
