using DAL.Common;
using DBManager;
using Entities.HRM;
using Entities.HRM.DTO;
using Entities.HRM.Report;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace DAL.HRM
{
    public class Report2DataService
    {
        private SqlDataAdapter da;
        private SqlConnection dbConn;
        private SqlCommand cmd;
        private DataSet ds;
        private DataTable dt;
        private readonly CommonDataService _common = new CommonDataService("SqlConnectionStringHRM");
        private string ConnectionString = ConfigurationManager.ConnectionStrings["SqlConnectionStringFactoryDB"].ConnectionString;
        public DataSet GetDesignationWiseAttendanceSummaryReport(string condition)
        {
            string query = string.Format(@"SELECT  A.EmpID,a.CompanyName,BranchName=a.UnitName,a.DepartmentName,a.DesignationName, A.WorkDay, A.AttStatus, 
		a.EmpCode,a.EmpName,
		TotalDays=datediff(day, dateadd(day, 1-day(WorkDay), WorkDay),dateadd(month, 1, dateadd(day, 1-day(WorkDay), WorkDay))),
		WorkYear=Year(WorkDay)
		into ##tbl1
		FROM Attendance_EmployeeAttendanceAllFactory a
		{0}
		order by a.WorkDay

		select EmpCode,CompanyName,BranchName,DesignationName,WorkYear,Month(WorkDay) WorkMonth,TotalDays,
		case when AttStatus='P' then Count(AttStatus) else 0 end P,
		case when AttStatus='LT' then Count(AttStatus) else 0 end LT,
		case when AttStatus='CL' then Count(AttStatus) else 0 end CL,
		case when AttStatus='ML' then Count(AttStatus) else 0 end ML,
		case when AttStatus='AL' then Count(AttStatus) else 0 end AL,
		case when AttStatus='H' then Count(AttStatus) else 0 end H,
		case when AttStatus='WO' then Count(AttStatus) else 0 end WO,
		case when AttStatus='LWP' then Count(AttStatus) else 0 end LWP,
		case when AttStatus='A' then Count(AttStatus) else 0 end A,
		case when AttStatus='LWA' then Count(AttStatus) else 0 end LWA,
		case when AttStatus='SPL' then Count(AttStatus) else 0 end SPL,
        case when AttStatus='NOP' then Count(AttStatus) else 0 end NOP,
		case when AttStatus='EXL' then Count(AttStatus) else 0 end EXL,
		case when AttStatus='EE' then Count(AttStatus) else 0 end EE
		into ##tbl2
		from ##tbl1 
		group by EmpCode,CompanyName,BranchName,DesignationName,WorkYear,Month(WorkDay),TotalDays,AttStatus

		select EmpCode,CompanyName,BranchName,DesignationName,WorkYear,WorkMonth,TotalDays,Present=sum(P),Absence=Sum(A),CasualLeave=sum(CL),Holiday=sum(H),SickLeave=sum(ML),
		WeekOff=sum(WO),AnnualLeave=sum(AL),LeaveWithoutPay=sum(LWP),Late=sum(LT),LeaveWithouAbsense=sum(LWA),SpecialLeave=sum(SPL),
		PresentLate=sum(P)+sum(LT),
        NoOutPunch=sum(NOP),ExLate=sum(EXL),EarlyExit=sum(EE),
		TotalPayDay=sum(P)+sum(CL)+sum(H)+sum(ML)+sum(WO)+sum(AL)+sum(LT)
		into ##tbl3
		from ##tbl2
		group by EmpCode,CompanyName,BranchName,DesignationName,WorkYear,WorkMonth,TotalDays
		order by WorkYear,WorkMonth

		select CompanyName,BranchName,DesignationName,TotalEmployee=count(EmpCode),
		Present=sum(Present),Late=sum(Late),PresentLate=sum(PresentLate),Absence=sum(Absence),
		CasualLeave=sum(CasualLeave),AnnualLeave=sum(AnnualLeave),SickLeave=sum(SickLeave),LeaveWithoutPay=sum(LeaveWithoutPay),
		LeaveWithouAbsense=sum(LeaveWithouAbsense),SpecialLeave=sum(SpecialLeave),WeekOff=sum(WeekOff),Holiday=sum(Holiday),
        NoOutPunch=sum(NoOutPunch),ExLate=sum(ExLate),EarlyExit=sum(EarlyExit)
		from ##tbl3 a
		group by CompanyName,BranchName,DesignationName
		order by CompanyName,BranchName,DesignationName
	
		drop table ##tbl1
		drop table ##tbl2
		drop table ##tbl3 ", condition);
            return _common.GetDataSetWithConStr(query, ConnectionString);
        }

        public List<Common_Company> GetCompanyData(string compTypeIds)
        {
            return _common.Select_Data_List<Common_Company>("sp_Factory_Report", "Get_Company_Data", compTypeIds == null ? "" : compTypeIds);
        }

        public List<Common_Unit> GetUnitData(string companyIds)
        {
            return _common.Select_Data_List<Common_Unit>("sp_Factory_Report", "Get_Unit_Data", companyIds);
        }
        public List<Common_Section> GetSectionData(string companyIds, string unitIds)
        {
            return _common.Select_Data_List<Common_Section>("sp_Factory_Report", "Get_Section_Data", companyIds, unitIds);
        }
        public List<Common_Department> GetDepartmentData(string companyIds, string unitIds)
        {
            return _common.Select_Data_List<Common_Department>("sp_Factory_Report", "Get_Department_Data", companyIds, unitIds);
        }
        public List<Common_Designation> GetDesignationData(string companyIds, string unitIds)
        {
            return _common.Select_Data_List<Common_Designation>("sp_Factory_Report", "Get_Designation_Data", companyIds, unitIds);
        }

        public DataSet GetOperationSummaryReportRdlc(string condition, string fromDate, string condition3)
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");

            string query = string.Format(@"declare @from_date datetime, @till_date datetime set @from_date='{0}' set @till_Date='{0}'

	select CompanyId,UnitId,DepartmentId,SectionId,EmpId, 
		SUM(ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
                * AxWorkTime / 60, 0)) AS D_ComOTAmount, 
				SUM(ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
                / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0)) AS D_EXOTAmount, 
				SUM(TiffinDay * Tiffin_rate_amt) AS TiffinAmount, 
				SUM(Holiday * Over_All_amt) AS holiAmount, 
                SUM(nightday * Night_Allowance) AS NightAmount ,
				MonthTotalOTAmt=(SUM(ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
                * AxWorkTime / 60, 0)))+(SUM(ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
                / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0)))
				+(SUM(TiffinDay * Tiffin_rate_amt))
				+(SUM(Holiday * Over_All_amt))
				+ (SUM(nightday * Night_Allowance))
				into ##tblOT{3}
		from Attendance_EmployeeAttendanceAllFactory a
            {2}
			GROUP BY CompanyId,UnitId,DepartmentId,SectionId,EmpId
        ORDER BY  CompanyId,UnitId,DepartmentId,SectionId
  

SELECT        company_name=CompanyName, branch_name=UnitName, department_code=a.DepartmentId, department_name=DepartmentName, section_code=a.SectionId, section_name=SectionName, 
    emp_id=a.EmpId, emp_name=EmpName, designation_name=DesignationName, category_name=CategoryName,Resigned, 
                (CASE WHEN over_time = 0 THEN 0 ELSE 1 END) AS Worker, (CASE WHEN over_time = 1 THEN 0 ELSE 1 END) AS Staff, (CASE WHEN over_time = 0 THEN gross_salary ELSE 0 END) AS Salary, 
                (CASE WHEN over_time = 1 THEN gross_salary ELSE 0 END) AS Wages, 
				(CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
                AS OTRate,
				Over_Time, Tiffin_rate, Tiffin_rate_amt, Over_All, Over_All_amt, Night_Holder, Night_Allowance, EMP_NO=a.EmpId, Work_date=WorkDay, DATEPART(week, DATEADD(DD, - (CHOOSE(DATEPART(dw, 
                WorkDay), 2, 3, 4, 5, 6, 7, 1) - 1), WorkDay)) AS Week, 
            (CASE WHEN over_time = 0 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, 
                DATEADD(MM, DATEDIFF(MM, - 1, @from_date), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Salary, (CASE WHEN over_time = 1 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') 
                THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, @from_date), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Wages, AxWorkTime / 60 AS ComOT, ExWorkTime / 60 AS EXOT, 
                (CASE WHEN (AxWorkTime / 60) = 1 THEN 1 ELSE 0 END) AS comOTEMP1hr, (CASE WHEN (AxWorkTime / 60) = 2 THEN 1 ELSE 0 END) AS comOTEMP2hr, (CASE WHEN (ExWorkTime / 60) = 1 THEN 1 ELSE 0 END) 
                AS exOTEMP1hr, (CASE WHEN (ExWorkTime / 60) = 2 THEN 1 ELSE 0 END) AS exOTEMP2hr, (CASE WHEN (ExWorkTime / 60) = 3 THEN 1 ELSE 0 END) AS exOTEMP3hr, (CASE WHEN (ExWorkTime / 60) 
                >= 4 THEN 1 ELSE 0 END) AS 'exOTEMPgt3hr', (CASE WHEN ((AxWorkTime / 60) + (ExWorkTime / 60)) > 0 THEN 1 ELSE 0 END) AS OTEMP, 
				ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
                * AxWorkTime / 60, 0) AS D_ComOTAmount, 
				ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
                / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0) AS D_EXOTAmount, 
				TiffinDay * Tiffin_rate_amt AS TiffinAmount, 
                (CASE WHEN (TiffinDay * Tiffin_rate_amt) > 0 THEN 1 ELSE 0 END) AS TiffinEmp, 
				Holiday * Over_All_amt AS holiAmount, 
				(CASE WHEN (Holiday * Over_All_amt) > 0 THEN 1 ELSE 0 END) AS HolidayEmp, 
                nightday * Night_Allowance AS NightAmount, 
				(CASE WHEN (nightday * Night_Allowance) > 0 THEN 1 ELSE 0 END) AS NightEmp, shift_code, org_att_status=AttStatus, ((((CASE WHEN AttStatus NOT IN ('A', 
                'LWP', 'MTL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, @from_date), 0))), 0) ELSE 0 END) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * AxWorkTime / 60, 0) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * ExWorkTime / 60, 0)) + TiffinDay * Tiffin_rate_amt) + Holiday * Over_All_amt) 
                + nightday * Night_Allowance AS TotalAmount,Ifter_Holder,Ifter_Allowance,MonthTotalOTAmt
        FROM           Attendance_EmployeeAttendanceAllFactory a
		right join ##tblOT{3} b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId and a.DepartmentId=b.DepartmentId and a.SectionId=b.SectionId and a.EmpId=b.EmpId
                    {1}
                    ORDER BY CompanyName, UnitName, DepartmentName ,SectionName, CategoryName,a.EmpId, WorkDay
        drop table ##tblOT{3}
        ", fromDate, condition, condition3, guidId);
            return _common.GetDataSetWithConStr(query, ConnectionString);
        }

        public DataSet GetOperationSummaryCompanyWiseReportRdlc(string condition, string fromDate, string condition3)
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");

            string query = string.Format(@"declare @from_date datetime, @till_date datetime set @from_date='{0}' set @till_Date='{0}'

	select CompanyId,UnitId,DepartmentId,SectionId,EmpId, 
		SUM(ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
                * AxWorkTime / 60, 0)) AS D_ComOTAmount, 
				SUM(ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
                / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0)) AS D_EXOTAmount, 
				SUM(TiffinDay * Tiffin_rate_amt) AS TiffinAmount, 
				SUM(Holiday * Over_All_amt) AS holiAmount, 
                SUM(nightday * Night_Allowance) AS NightAmount ,
				MonthTotalOTAmt=(SUM(ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
                * AxWorkTime / 60, 0)))+(SUM(ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
                / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0)))
				+(SUM(TiffinDay * Tiffin_rate_amt))
				+(SUM(Holiday * Over_All_amt))
				+ (SUM(nightday * Night_Allowance))
				into ##tblOT{3}
		from Attendance_EmployeeAttendanceAllFactory a
            {2}
			GROUP BY CompanyId,UnitId,DepartmentId,SectionId,EmpId
        ORDER BY  CompanyId,UnitId,DepartmentId,SectionId
  

SELECT        company_name=CompanyName, branch_name=UnitName, department_code=a.DepartmentId, department_name=DepartmentName, section_code=a.SectionId, section_name=SectionName, 
    emp_id=a.EmpId, emp_name=EmpName, designation_name=DesignationName, category_name=CategoryName,Resigned, 
                (CASE WHEN over_time = 0 THEN 0 ELSE 1 END) AS Worker, (CASE WHEN over_time = 1 THEN 0 ELSE 1 END) AS Staff, (CASE WHEN over_time = 0 THEN gross_salary ELSE 0 END) AS Salary, 
                (CASE WHEN over_time = 1 THEN gross_salary ELSE 0 END) AS Wages, 
				(CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
                AS OTRate,
				Over_Time, Tiffin_rate, Tiffin_rate_amt, Over_All, Over_All_amt, Night_Holder, Night_Allowance, EMP_NO=a.EmpId, Work_date=WorkDay, DATEPART(week, DATEADD(DD, - (CHOOSE(DATEPART(dw, 
                WorkDay), 2, 3, 4, 5, 6, 7, 1) - 1), WorkDay)) AS Week, 
            (CASE WHEN over_time = 0 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, 
                DATEADD(MM, DATEDIFF(MM, - 1, @from_date), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Salary, (CASE WHEN over_time = 1 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') 
                THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, @from_date), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Wages, AxWorkTime / 60 AS ComOT, ExWorkTime / 60 AS EXOT, 
                (CASE WHEN (AxWorkTime / 60) = 1 THEN 1 ELSE 0 END) AS comOTEMP1hr, (CASE WHEN (AxWorkTime / 60) = 2 THEN 1 ELSE 0 END) AS comOTEMP2hr, (CASE WHEN (ExWorkTime / 60) = 1 THEN 1 ELSE 0 END) 
                AS exOTEMP1hr, (CASE WHEN (ExWorkTime / 60) = 2 THEN 1 ELSE 0 END) AS exOTEMP2hr, (CASE WHEN (ExWorkTime / 60) = 3 THEN 1 ELSE 0 END) AS exOTEMP3hr, (CASE WHEN (ExWorkTime / 60) 
                >= 4 THEN 1 ELSE 0 END) AS 'exOTEMPgt3hr', (CASE WHEN ((AxWorkTime / 60) + (ExWorkTime / 60)) > 0 THEN 1 ELSE 0 END) AS OTEMP, 
				ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
                * AxWorkTime / 60, 0) AS D_ComOTAmount, 
				ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
                / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0) AS D_EXOTAmount, 
				TiffinDay * Tiffin_rate_amt AS TiffinAmount, 
                (CASE WHEN (TiffinDay * Tiffin_rate_amt) > 0 THEN 1 ELSE 0 END) AS TiffinEmp, 
				Holiday * Over_All_amt AS holiAmount, 
				(CASE WHEN (Holiday * Over_All_amt) > 0 THEN 1 ELSE 0 END) AS HolidayEmp, 
                nightday * Night_Allowance AS NightAmount, 
				(CASE WHEN (nightday * Night_Allowance) > 0 THEN 1 ELSE 0 END) AS NightEmp, shift_code, org_att_status=AttStatus, ((((CASE WHEN AttStatus NOT IN ('A', 
                'LWP', 'MTL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, @from_date), 0))), 0) ELSE 0 END) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * AxWorkTime / 60, 0) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * ExWorkTime / 60, 0)) + TiffinDay * Tiffin_rate_amt) + Holiday * Over_All_amt) 
                + nightday * Night_Allowance AS TotalAmount,Ifter_Holder,Ifter_Allowance,MonthTotalOTAmt
        FROM           Attendance_EmployeeAttendanceAllFactory a
		inner join ##tblOT{3} b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId and a.DepartmentId=b.DepartmentId and a.SectionId=b.SectionId and a.EmpId=b.EmpId
                    {1}
                    ORDER BY CompanyName, UnitName, DepartmentName ,SectionName, CategoryName,a.EmpId, WorkDay
        drop table ##tblOT{3}
        ", fromDate, condition, condition3, guidId);
            return _common.GetDataSetWithConStr(query, ConnectionString);
        }

        public List<ManpowerReport> GetManpowerReportData(string condition, string date)
        {
            //          string guidId = Guid.NewGuid().ToString().Replace("-", "");

            //          string query = string.Format(@"SELECT 
            //          EmpId,CompanyId,CompanyName,UnitId,UnitName,SectionId ,b.SortOrder,DesigGroup,sectionname=case when sectionname like 'Button Section' then 'Finishing' else sectionname end,WorkDay,

            //          --CASE WHEN AttStatus IN ('P', 'LT', 'SD', 'TL') THEN round((gross_salary / 31.00),0) ELSE 0 END AS D_Salary,

            //      (CASE WHEN over_time = 0 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, 
            //DATEADD(MM, DATEDIFF(MM, - 1, '{1}'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Salary,

            //      (CASE WHEN over_time = 1 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') 
            //   THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '{1}'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Wages,


            //   ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
            //   Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
            //   * AxWorkTime / 60, 0) AS D_ComOTAmount,

            //    ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
            //   / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0) AS D_EXOTAmount, 

            //   TiffinDay * Tiffin_rate_amt AS TiffinAmount, 

            //   (CASE WHEN (TiffinDay * Tiffin_rate_amt) > 0 THEN 1 ELSE 0 END) AS TiffinEmp, Holiday * Over_All_amt AS holiAmount, 

            //   nightday * Night_Allowance AS NightAmount,

            //   ((((CASE WHEN AttStatus IN ('P', 'LT', 'SD', 'TL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '{1}'), 0))), 0) ELSE 0 END) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
            //                           Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * AxWorkTime / 60, 0) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
            //                           Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * ExWorkTime / 60, 0)) + TiffinDay * Tiffin_rate_amt) + Holiday * Over_All_amt) 
            //                           + nightday * Night_Allowance AS TotalAmount


            //          into ##tbl{2}
            //          from Attendance_EmployeeAttendanceAllFactory a
            //          left join DesignationAllFactory b on a.DesignationId=b.DesignationId
            //          {0} 
            //          select CountEmp=Count(EmpId),CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName ,SortOrder,DesigGroup,WorkDay,Salary=sum(D_Salary)+sum(D_Wages),
            //          DayTotalCost = SUM(D_ComOTAmount)+SUM(D_EXOTAmount)+SUM(TiffinAmount)+SUM(holiAmount)+SUM(NightAmount),
            //          D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(holiAmount),NightAmount=SUM(NightAmount)
            //          from ##tbl{2}
            //          GROUP by CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,SortOrder,DesigGroup,WorkDay
            //          ORDER by SortOrder, CompanyName,UnitName,SectionName,DesigGroup

            //          drop table ##tbl{2}
            //          ", condition, date, guidId);

            string query = string.Format(@"SELECT * FROM DeptWiseDailyData {0}  
            ORDER by SortOrder, CompanyName,UnitName,SectionName,DesigGroup", condition);

            return Data<ManpowerReport>.DataSourceWithConstr(query, ConnectionString);

        }

        public List<ManpowerReport> GetManpowerReportDataSub(string condition, string date)
        {
            //      string guidId = Guid.NewGuid().ToString().Replace(" - ", "");

            //      string query = string.Format(@"SELECT 
            //      EmpId,CompanyId,CompanyName,UnitId,UnitName,SectionId ,b.SortOrder,DesigGroup,sectionname=case when sectionname like 'Button Section' then 'Finishing' else sectionname end,WorkDay,

            //     -- CASE WHEN AttStatus IN ('P', 'LT', 'SD', 'TL') THEN round((gross_salary / 31.00),0) ELSE 0 END AS D_Salary,

            //     (CASE WHEN over_time = 0 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, 
            //DATEADD(MM, DATEDIFF(MM, - 1, '{1}'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Salary,

            //      (CASE WHEN over_time = 1 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') 
            //   THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '{1}'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Wages,



            //   ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
            //   Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
            //   * AxWorkTime / 60, 0) AS D_ComOTAmount,

            //    ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
            //   / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0) AS D_EXOTAmount, 

            //   TiffinDay * Tiffin_rate_amt AS TiffinAmount, 

            //   (CASE WHEN (TiffinDay * Tiffin_rate_amt) > 0 THEN 1 ELSE 0 END) AS TiffinEmp, Holiday * Over_All_amt AS holiAmount, 

            //   nightday * Night_Allowance AS NightAmount,

            //      ((((CASE WHEN AttStatus IN ('P', 'LT', 'SD', 'TL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '{1}'), 0))), 0) ELSE 0 END) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
            //                           Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * AxWorkTime / 60, 0) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
            //                           Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * ExWorkTime / 60, 0)) + TiffinDay * Tiffin_rate_amt) + Holiday * Over_All_amt) 
            //                           + nightday * Night_Allowance AS TotalAmount

            //      into ##tbl{2}
            //      from Attendance_EmployeeAttendanceAllFactory a
            //      left join DesignationAllFactory b on a.DesignationId=b.DesignationId
            //      {0} 
            //      select CountEmp=Count(EmpId),CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName ,SortOrder,DesigGroup,WorkDay,Salary=sum(D_Salary)+sum(D_Wages),
            //      DayTotalCost = SUM(D_ComOTAmount)+SUM(D_EXOTAmount)+SUM(TiffinAmount)+SUM(holiAmount)+SUM(NightAmount),
            //      D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(holiAmount),NightAmount=SUM(NightAmount)
            //      from ##tbl{2}
            //      GROUP by CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,SortOrder,DesigGroup,WorkDay
            //      ORDER by SortOrder, CompanyName,UnitName,SectionName,DesigGroup

            //      drop table ##tbl{2}
            //      ", condition, date, guidId);


            string query = string.Format(@"SELECT * FROM DeptWiseDailyData {0} 
            ORDER by SortOrder, CompanyName,UnitName,SectionName,DesigGroup
            ", condition);

            return Data<ManpowerReport>.DataSourceWithConstr(query, ConnectionString);
        }

        public List<ManpowerReport> GetProductionData(string condition, string date)
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");

            string query = string.Format(@"
            SELECT DISTINCT ST2.LineId, 
                SUBSTRING(
                    (
                        SELECT ','+ ST1.Buyer_name  AS [text()]
                        FROM (select distinct Lineid,  Buyer_name from ProductionManagementLive.dbo.View_HourlyProduction where ProductionDate='{1}'
	               ) ST1
                        WHERE  ST1.LineId = ST2.LineId
                        ORDER BY ST1.LineId
                        FOR XML PATH ('')
                    ), 2, 1000) BuyerName
		            into ##tblBuyer{2}
            FROM (select distinct Lineid,  Buyer_name from ProductionManagementLive.dbo.View_HourlyProduction where ProductionDate='{1}'
	               ) ST2

            SELECT WorkDay=H.ProductionDate,H.UnitId,L.PreviousId AS SectionId
	          ,ISNULL(SUM(D.Qty*S.CMFactoryTK),0) AS Earn
              ,SUM(D.Qty) ProdQty
		      ,BuyerName
            FROM ProductionManagementLive.dbo.HourlyProduction H

            LEFT JOIN ProductionManagementLive.dbo.HourlyProductionDetail D ON D.HourlyProductionId=H.Id
            LEFT JOIN ProductionManagementLive.dbo.LineNew L ON L.LineId=H.LineId
            LEFT JOIN ProductionManagementLive.dbo.CP_Style S ON S.Id=H.StyleId
	        LEFT JOIN ##tblBuyer{2} buyer on buyer.LineId=H.LineId
            {0}
            GROUP BY  H.ProductionDate,BuyerName
		    ,H.UnitId
	       ,L.PreviousId
            drop table ##tblBuyer{2}
            ", condition, date, guidId);

            return Data<ManpowerReport>.DataSourceWithConstr(query, ConnectionString);
        }

        public List<ManpowerReport> GetManpowerByDesigType(string condition, string date)
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");
            string query = string.Format(@"SELECT 
            EmpId,CompanyId,CompanyName,UnitId,UnitName,b.SortOrder,DesigGroup,sectionname=case when sectionname like 'Button Section' then 'Finishing' else sectionname end, WorkDay,
            
            --(CASE WHEN AttStatus IN ('P', 'LT') THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '{1}'), 0))), 0) ELSE 0 END)  AS D_Salary

               (CASE WHEN over_time = 0 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, 
		    DATEADD(MM, DATEDIFF(MM, - 1, '{1}'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Salary,

            (CASE WHEN over_time = 1 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') 
	        THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '{1}'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Wages,

            ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
	        Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
	        * AxWorkTime / 60, 0) AS D_ComOTAmount,

	         ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
	        / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0) AS D_EXOTAmount, 
	
	        TiffinDay * Tiffin_rate_amt AS TiffinAmount, 

	         Holiday * Over_All_amt AS holiAmount, 
	
	        nightday * Night_Allowance AS NightAmount,

            ((((CASE WHEN AttStatus IN ('P', 'LT', 'SD', 'TL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '{1}'), 0))), 0) ELSE 0 END) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                                 Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * AxWorkTime / 60, 0) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                                 Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * ExWorkTime / 60, 0)) + TiffinDay * Tiffin_rate_amt) + Holiday * Over_All_amt) 
                                 + nightday * Night_Allowance AS TotalAmount

            into ##tbl{2}
            from Attendance_EmployeeAttendanceAllFactory a
            left join DesignationAllFactory b on a.DesignationId=b.DesignationId
            {0} 
            select CountEmp=Count(EmpId),CompanyId,CompanyName,UnitId,UnitName,DesigGroup,SortOrder,Salary=sum(D_Salary)+sum(D_Wages) , WorkDay,
            DayTotalCost = SUM(D_ComOTAmount)+SUM(D_EXOTAmount)+SUM(TiffinAmount)+SUM(holiAmount)+SUM(NightAmount),
            D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(holiAmount),NightAmount=SUM(NightAmount)
            from ##tbl{2}
            GROUP by CompanyId,CompanyName,UnitId,UnitName,DesigGroup,SortOrder,WorkDay
            ORDER by SortOrder, CompanyName,UnitName

            drop table ##tbl{2}
            ", condition, date, guidId);

            return Data<ManpowerReport>.DataSourceWithConstr(query, ConnectionString);
        }

        public List<MISCost> GetMISCost(string sql)
        {
            var oMISCosts = Data<MISCost>.DataSourceWithConstr(sql, ConnectionString);
            if (oMISCosts == null || oMISCosts.Count() == 0) return new List<MISCost>();
            return oMISCosts;
        }

        public DataSet GetUnitWiseManpowerData(string condition)
        {
            string guidId1 = Guid.NewGuid().ToString().Replace("-", "");
            string guidId2 = Guid.NewGuid().ToString().Replace("-", "");
            string query = string.Format(@" SELECT 
	        EmpId,CompanyId,CompanyName,UnitId,UnitName,DepartmentId,DepartmentName,a.DesignationName,DesigGroup,
	        sectionname=case when sectionname like 'Button Section' then 'Finishing' else sectionname end,
	        gross_salary,b.SortOrder
	        into ##tblManpower{1}
	        from Attendance_EmployeeAttendanceAllFactory a
	        left join DesignationAllFactory b on a.DesignationId=b.DesignationId
	        {0}

	        select  CompanyId,UnitId,TotalSection=count(distinct sectionname )
	        into ##tblLine{2}
	        from ##tblManpower{1} where sectionname like 'LINE%'
	        group by CompanyId,UnitId
            
	        select a.CompanyId,CompanyName,a.UnitId,UnitName,DepartmentId,DepartmentName,DesignationName,
	        GrossSalary=sum(gross_salary),CountEmp=Count(EmpId),TotalSection
	        from ##tblManpower{1} a
	        inner join ##tblLine{2} b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
	        GROUP by a.CompanyId,CompanyName,a.UnitId,UnitName,DepartmentId,DepartmentName,DesignationName,TotalSection,SortOrder
	        ORDER by CompanyName,UnitName,DepartmentId,DepartmentName,DesignationName,SortOrder ,TotalSection

	        drop table ##tblManpower{1}
	        drop table ##tblLine{2}
            ", condition, guidId1, guidId2);

            // return Data<ManpowerReport>.DataSourceWithConstr(query, ConnectionString);
            return _common.GetDataSetWithConStr(query, ConnectionString);
        }
        public DataSet GetManPowerDataRdlc(string condition)//TEST
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");
            string query = string.Format(@" SELECT 
                EmpId,CompanyId,CompanyName,UnitId,UnitName,SectionId ,b.SortOrder,DesigGroup,sectionname=case when sectionname like 'Button Section' then 'Finishing' else sectionname end,
                (CASE WHEN over_time = 0 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, 
                DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Salary,
                (CASE WHEN over_time = 1 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') 
                THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Wages,
                ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
                * AxWorkTime / 60, 0) AS D_ComOTAmount,
                ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
                / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0) AS D_EXOTAmount, 
                TiffinDay * Tiffin_rate_amt AS TiffinAmount, 
                (CASE WHEN (TiffinDay * Tiffin_rate_amt) > 0 THEN 1 ELSE 0 END) AS TiffinEmp, Holiday * Over_All_amt AS holiAmount, 
                nightday * Night_Allowance AS NightAmount,
                ((((CASE WHEN AttStatus IN ('P', 'LT', 'SD', 'TL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                    Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * AxWorkTime / 60, 0) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                    Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * ExWorkTime / 60, 0)) + TiffinDay * Tiffin_rate_amt) + Holiday * Over_All_amt) 
                    + nightday * Night_Allowance AS TotalAmount,
                ReportType='Sewing',SL=1
                into #tblManpower{1}
                from Attendance_EmployeeAttendanceAllFactory a
                left join DesignationAllFactory b on a.DesignationId=b.DesignationId
                where 1=1  AND SectionName LIKE 'LINE%'  AND DesigType <> 1 {0}

                union all

                SELECT 
                EmpId,CompanyId,CompanyName,UnitId,UnitName,SectionId ,b.SortOrder,DesigGroup,sectionname=case when sectionname like 'Button Section' then 'Finishing' else sectionname end,
                (CASE WHEN over_time = 0 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, 
                DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Salary,
                (CASE WHEN over_time = 1 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') 
                THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Wages,
                ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
                * AxWorkTime / 60, 0) AS D_ComOTAmount,
                ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
                / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0) AS D_EXOTAmount, 
                TiffinDay * Tiffin_rate_amt AS TiffinAmount, 
                (CASE WHEN (TiffinDay * Tiffin_rate_amt) > 0 THEN 1 ELSE 0 END) AS TiffinEmp, Holiday * Over_All_amt AS holiAmount, 
                nightday * Night_Allowance AS NightAmount,
                ((((CASE WHEN AttStatus IN ('P', 'LT', 'SD', 'TL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * AxWorkTime / 60, 0) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * ExWorkTime / 60, 0)) + TiffinDay * Tiffin_rate_amt) + Holiday * Over_All_amt) 
                + nightday * Night_Allowance AS TotalAmount,
                ReportType='Finishing',SL=2
                from Attendance_EmployeeAttendanceAllFactory a
                left join DesignationAllFactory b on a.DesignationId=b.DesignationId
                where 1=1  AND DesigType <> 1 AND DepartmentName LIKE 'finishing%' {0} 
  
                union all

                SELECT 
                EmpId,CompanyId,CompanyName,UnitId,UnitName,SectionId ,b.SortOrder,DesigGroup,sectionname=case when sectionname like 'Button Section' then 'Finishing' else sectionname end,
                (CASE WHEN over_time = 0 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, 
                DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Salary,
                (CASE WHEN over_time = 1 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') 
                THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Wages,
                ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
                * AxWorkTime / 60, 0) AS D_ComOTAmount,
                ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
                / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0) AS D_EXOTAmount, 
                TiffinDay * Tiffin_rate_amt AS TiffinAmount, 
                (CASE WHEN (TiffinDay * Tiffin_rate_amt) > 0 THEN 1 ELSE 0 END) AS TiffinEmp, Holiday * Over_All_amt AS holiAmount, 
                nightday * Night_Allowance AS NightAmount,
                ((((CASE WHEN AttStatus IN ('P', 'LT', 'SD', 'TL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * AxWorkTime / 60, 0) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * ExWorkTime / 60, 0)) + TiffinDay * Tiffin_rate_amt) + Holiday * Over_All_amt) 
                + nightday * Night_Allowance AS TotalAmount,
                ReportType='Cutting' ,SL=3
                from Attendance_EmployeeAttendanceAllFactory a
                left join DesignationAllFactory b on a.DesignationId=b.DesignationId
                where 1=1  AND DesigType <> 1 AND DepartmentName LIKE 'cutting%' {0}   

                union all

                SELECT 
                EmpId,CompanyId,CompanyName,UnitId,UnitName,SectionId ,b.SortOrder,DesigGroup,sectionname=case when sectionname like 'Button Section' then 'Finishing' else sectionname end,
                (CASE WHEN over_time = 0 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, 
                DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Salary,
                (CASE WHEN over_time = 1 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') 
                THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Wages,
                ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
                * AxWorkTime / 60, 0) AS D_ComOTAmount,
                ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
                / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0) AS D_EXOTAmount, 
                TiffinDay * Tiffin_rate_amt AS TiffinAmount, 
                (CASE WHEN (TiffinDay * Tiffin_rate_amt) > 0 THEN 1 ELSE 0 END) AS TiffinEmp, Holiday * Over_All_amt AS holiAmount, 
                nightday * Night_Allowance AS NightAmount,
                ((((CASE WHEN AttStatus IN ('P', 'LT', 'SD', 'TL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * AxWorkTime / 60, 0) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * ExWorkTime / 60, 0)) + TiffinDay * Tiffin_rate_amt) + Holiday * Over_All_amt) 
                + nightday * Night_Allowance AS TotalAmount,
                ReportType='Others' ,SL=4
                from Attendance_EmployeeAttendanceAllFactory a
                left join DesignationAllFactory b on a.DesignationId=b.DesignationId
                where 1=1  AND DesigType <> 1 AND (DepartmentName NOT LIKE 'FINISHING%' AND DepartmentName NOT LIKE 'CUTTING%' AND SECTIONNAME NOT LIKE 'LINE%')
                {0}

                union all

                SELECT 
                EmpId,CompanyId,CompanyName,UnitId,UnitName,SectionId ,b.SortOrder,DesigGroup,sectionname=case when sectionname like 'Button Section' then 'Finishing' else sectionname end,
                (CASE WHEN over_time = 0 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, 
                DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Salary,
                (CASE WHEN over_time = 1 THEN (CASE WHEN AttStatus NOT IN ('A', 'LWP', 'MTL') 
                THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) ELSE 0 END) AS D_Wages,
                ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) 
                * AxWorkTime / 60, 0) AS D_ComOTAmount,
                ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND Over_Time = 1 THEN (CASE WHEN WorkDay >= '2018-12-01' THEN ROUND((ROUND((gross_salary - 1850) 
                / 1.5, 2)) / 104, 2) ELSE ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) END) ELSE 0 END) * ExWorkTime / 60, 0) AS D_EXOTAmount, 
                TiffinDay * Tiffin_rate_amt AS TiffinAmount, 
                (CASE WHEN (TiffinDay * Tiffin_rate_amt) > 0 THEN 1 ELSE 0 END) AS TiffinEmp, Holiday * Over_All_amt AS holiAmount, 
                nightday * Night_Allowance AS NightAmount,
                ((((CASE WHEN AttStatus IN ('P', 'LT', 'SD', 'TL') THEN round(gross_salary / DAY(DATEADD(DD, - 1, DATEADD(MM, DATEDIFF(MM, - 1, '23-Jul-2020'), 0))), 0) ELSE 0 END) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * AxWorkTime / 60, 0) + ROUND((CASE WHEN emp_status IN (0, 1, 3, 4, 5) AND 
                Over_Time = 1 THEN ROUND((ROUND((gross_salary - 1100) / 1.4, 2)) / 104, 2) ELSE 0 END) * ExWorkTime / 60, 0)) + TiffinDay * Tiffin_rate_amt) + Holiday * Over_All_amt) 
                + nightday * Night_Allowance AS TotalAmount,
                ReportType='Management' ,SL=0
                from Attendance_EmployeeAttendanceAllFactory a
                left join DesignationAllFactory b on a.DesignationId=b.DesignationId
                where 1=1  AND DesigType = 1 {0}

                select  CompanyName,ReportType,DesigGroup,CountEmp=count(EmpId),D_Salary=Sum(D_Salary),D_Wages=Sum(D_Wages),Salary=Sum(D_Salary)+Sum(D_Wages),
                D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),holiAmount=Sum(holiAmount),NightAmount=Sum(NightAmount),
                OTCost=Sum(D_ComOTAmount)+Sum(D_EXOTAmount)+Sum(TiffinAmount)+Sum(holiAmount)+Sum(NightAmount)
                from #tblManpower
                group by CompanyName,ReportType,DesigGroup,SL
                order by CompanyName,SL,ReportType

                drop table #tblManpower{1}

            ", condition, guidId);

            // return Data<ManpowerReport>.DataSourceWithConstr(query, ConnectionString);
            return _common.GetDataSetWithConStr(query, ConnectionString);
        }

        public DataSet GetCompanyWiseOtRdlc(string condition)
        {
            string query = string.Format(@"select CompanyName,WorkDay,
		    TotalOT=sum(isnull(D_ComOTAmount,0)+isnull(D_EXOTAmount,0)+isnull(TiffinAmount,0)+isnull(HoliAmount,0)+isnull(NightAmount,0) )
		    from CompanyWiseDailyOPSummary a
		    {0}
		    group by CompanyName,WorkDay
		    order by CompanyName,WorkDay 
            ", condition);
            return _common.GetDataSetWithConStr(query, ConnectionString);
        }
        public DataSet GetCompanyWiseOpSummaryReportRdlc(string condition)
        {
            string query = string.Format(@"select CompanyName,WorkDay,
		    TotalOT=sum(isnull(D_ComOTAmount,0)+isnull(D_EXOTAmount,0)+isnull(TiffinAmount,0)+isnull(HoliAmount,0)+isnull(NightAmount,0) )
		    from CompanyWiseDailyOPSummary a
		    {0}
		    group by CompanyName,WorkDay
		    order by CompanyName,WorkDay 
            ", condition);
            return _common.GetDataSetWithConStr(query, ConnectionString);
        }

        public DataSet GetCompanyWiseOpSummaryRdlc(string condition, string fromDate)
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");
            string query = string.Format(@"select CompanyId,
	    TotalOT=sum(isnull(D_ComOTAmount,0)+isnull(D_EXOTAmount,0)+isnull(TiffinAmount,0)+isnull(HoliAmount,0)+isnull(NightAmount,0))
	    into #tblOTTillDate{2}
	    from CompanyWiseDailyOPSummary
	    Where 
	    WorkDay Between  DATEADD(month, DATEDIFF(month, 0, '{1}'), 0) and '{1}'
	    group by CompanyId

	    select Company_Name=a.CompanyName,a.WorkDay,TotalEmp=sum(TotalEmp),TotalStaff=sum(TotalStaff)
	    ,OTEMP=sum(OTEMP),comOTEMP1hr=sum(comOTEMP1hr),comOTEMP2hr=sum(comOTEMP2hr)
	    ,exOTEMP1hr=sum(exOTEMP1hr),exOTEMP2hr=sum(exOTEMP2hr) ,exOTEMP3hr=sum(exOTEMP3hr)
	    ,exOTEMPgt3hr=sum(exOTEMPgt3hr),TiffinEmp=sum(TiffinEmp),HolidayEmp=sum(HolidayEmp)
	    ,NightEmp=sum(NightEmp),ComOT=sum(ComOT),EXOT=sum(EXOT),D_Salary=sum(D_Salary)
	    ,D_Wages=sum(D_Wages),D_ComOTAmount=sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount)
	    ,TiffinAmount=sum(TiffinAmount),HoliAmount=sum(HoliAmount),NightAmount=sum(NightAmount)
	    ,TotalAmount=sum(TotalAmount),TotalWorker=sum(TotalWorker)
	    ,MonthTotalOTAmt=sum(TotalOT)
	    from CompanyWiseDailyOPSummary a
	    inner join #tblOTTillDate{2} b on a.CompanyId=b.CompanyId
	    {0}
	    group by a.CompanyName,a.WorkDay
	    order by a.CompanyName
	
	    drop table #tblOTTillDate{2}
            ", condition, fromDate, guidId);
            return _common.GetDataSetWithConStr(query, ConnectionString);
        }


        //================================================================New Query=======================================================

        public DataTable GetFactorySewingLineData(string condition, string compCondition, string prodCondition)
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");

            string query = string.Format(@"
        --For Getting All Line By Unit
	    select distinct a.CompanyId,a.UnitId,a.DepartmentId,a.SectionId
	    into ##tblCompWiseLine{0} 
	    from DeptWiseDailyData a
		inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
	   -- where WorkDay='21-Dec-2020' and CompanyId=14 and SectionName Like 'LINE%'
        {1}  AND isnull(b.ParentUnitId,0)>0 AND b.IsActive=1 
	    Group by a.CompanyId,a.UnitId,a.DepartmentId,a.SectionId,a.DesigGroup,a.SortOrder

		    --Comp Line Count
	    select a.CompanyId,a.UnitId,LineCount=COUNT(distinct a.SectionId) 
	    into ##tblUnitWiseLineCount{0}
	    from ##tblCompWiseLine{0} a
	   -- WHERE a.CompanyId=14
        {2}
	    GROUP BY a.CompanyId,a.UnitId


        --MIS Cost
	      select PowerUtilities=isnull(a.PowerUtilities,0),
	    RepairMtnSpares=isnull(a.RepairMtnSpares,0),
	    CarriageTransFreights=isnull(a.CarriageTransFreights,0),
	    IndirectMaterialServices=isnull(a.IndirectMaterialServices,0),
	    ConveyEntertainStationeryOthers=isnull(a.ConveyEntertainStationeryOthers,0),
	    TotalRents=isnull(a.TotalRents,0),
	    LocalCommissionTradePromotion=isnull(a.LocalCommissionTradePromotion,0),
	    FactoryOHincludingZonalExp=isnull(a.FactoryOHincludingZonalExp,0),
	    HeadOfficeOverhead=isnull(a.HeadOfficeOverhead,0),
	    DepreciationFactory=isnull(a.DepreciationFactory,0),
	    TTLEmpBenefitsExcludingSalaryWagOvrtNightHoliday=isnull(a.TTLEmpBenefitsExcludingSalaryWagOvrtNightHoliday,0),
		TotalMis=(
            isnull(a.PowerUtilities,0)
		    +isnull(a.RepairMtnSpares,0)
		    +isnull(a.CarriageTransFreights,0)
		    +isnull(a.IndirectMaterialServices,0) 
		    +isnull(a.ConveyEntertainStationeryOthers,0)
		    +isnull(a.TotalRents,0)
		    +isnull(a.LocalCommissionTradePromotion,0)
		    +isnull(a.FactoryOHincludingZonalExp,0)
		    +isnull(a.HeadOfficeOverhead,0)
		    +isnull(a.DepreciationFactory,0)
			+isnull(a.TTLEmpBenefitsExcludingSalaryWagOvrtNightHoliday,0)
            ),
	    c.CompanyId,a.UnitId,a.[Year],a.[Month]
	    Into ##tblMisCost{0}
	    from ProductionManagementLive.dbo.MISCost a
	    left join ProductionManagementLive.dbo.Unit U on a.UnitId=u.UnitId
	    inner join (
	    Select MaxYear=Max([Year]),MaxMonth=Max([Month]),CompanyId,a.UnitId from ProductionManagementLive.dbo.MISCost  mis
	    left join ProductionManagementLive.dbo.Unit a on mis.UnitId=a.UnitId
        {2}  and [Year]=( Select MaxYear=Max([Year]) from ProductionManagementLive.dbo.MISCost)
	    group by a.CompanyId,a.UnitId
	    ) c on c.CompanyId=u.CompanyId and c.UnitId=a.UnitId and a.Year=c.MaxYear and a.Month=c.MaxMonth

	    select a.CompanyId,a.UnitId,LineCount,
	    PowerUtilities=cast((a.PowerUtilities/cast(b.LineCount as decimal))as decimal(18,10)),
	    RepairMtnSpares=cast((a.RepairMtnSpares/cast(b.LineCount as decimal))as decimal(18,10)),
	    CarriageTransFreights=cast((a.CarriageTransFreights/cast(b.LineCount as decimal))as decimal(18,10)),
	    IndirectMaterialServices=cast((a.IndirectMaterialServices/cast(b.LineCount as decimal))as decimal(18,10)),
	    ConveyEntertainStationeryOthers=cast((a.ConveyEntertainStationeryOthers/cast(b.LineCount as decimal))as decimal(18,10)),
	    TotalRents=cast((a.TotalRents/cast(b.LineCount as decimal))as decimal(18,10)),
	    LocalCommissionTradePromotion=cast((a.LocalCommissionTradePromotion/cast(b.LineCount as decimal))as decimal(18,10)),
	    FactoryOHincludingZonalExp=cast((a.FactoryOHincludingZonalExp/cast(b.LineCount as decimal))as decimal(18,10)),
	    HeadOfficeOverhead=cast((a.HeadOfficeOverhead/cast(b.LineCount as decimal))as decimal(18,10)),
	    DepreciationFactory=cast((a.DepreciationFactory/cast(b.LineCount as decimal))as decimal(18,10)),
        TTL=cast((a.TTLEmpBenefitsExcludingSalaryWagOvrtNightHoliday/cast(b.LineCount as decimal))as decimal(18,10)),
        TotalMis=cast((a.TotalMis/cast(b.LineCount as decimal))as decimal(18,10))
	    INTO ##tblMisCost1{0}
	    from ##tblMisCost{0} a
	    INNER JOIN ##tblUnitWiseLineCount{0} b on b.CompanyId=a.CompanyId and b.UnitId=a.UnitId
	


        --OT Amount
	    select CompanyId,CompanyName,UnitId,UnitName,DepartmentId,SectionId,SectionName,DesigGroup,WorkDay,SortOrder,
	    CountEmp=Sum(CountEmp),Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),
	    TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount) 
	    into ##tbl1{0}
	    from DeptWiseDailyData a
	    --where WorkDay='21-Dec-2020' and CompanyId=14 and SectionName Like 'LINE%'
        {1}
	    Group by CompanyId,CompanyName,UnitId,UnitName,DepartmentId,SectionId,SectionName,DesigGroup,WorkDay,SortOrder
	    Order by SortOrder

	    ---Desig type Wise Manpower
	    Select pv.* 
	    into ##tbl2{0}
	    From
	    ( 
	    Select * From (
	    Select CompanyId,CompanyName,UnitId,UnitName,DepartmentId,WorkDay,SectionId,SectionName, DesigGroup,CountEmp,Salary,D_ComOTAmount,D_EXOTAmount,TiffinAmount,HolidayAmount,NightAmount From ##tbl1{0}
	    ) sal
	    PIVOT (SUM(CountEmp)for DesigGroup in([LineChief],[Supervisor],[Operator],[Helper],[JuniorIronman],[Loader],[SampleMachinist],[Quality],[FinishingAssistant],[GeneralPackingMan],[GeneratorOperator],[InputMan],[AssistantCutterMan],[IronMan],[Cleaner],[AssistantOfficer]) )As p 
	    )pv


      select CompanyId,CompanyName,UnitId,UnitName,DepartmentId,WorkDay,SectionId,SectionName,Salary=Sum(ISNULL(Salary,0)),D_ComOTAmount=Sum(ISNULL(D_ComOTAmount,0)),D_EXOTAmount=Sum(ISNULL(D_EXOTAmount,0)),TiffinAmount=Sum(ISNULL(TiffinAmount,0)),HolidayAmount=Sum(ISNULL(HolidayAmount,0)),NightAmount=Sum(ISNULL(NightAmount,0)),
      LineChief=Sum(ISNULL(LineChief,0)),Supervisor=Sum(ISNULL(Supervisor,0)),Operator=Sum(ISNULL(Operator,0)),Helper=Sum(ISNULL(Helper,0)),GeneratorOperator=Sum(ISNULL(GeneratorOperator,0)),Quality=Sum(ISNULL(Quality,0)),JuniorIronman=Sum(ISNULL(JuniorIronman,0)),InputMan=Sum(ISNULL(InputMan,0)),Loader=Sum(ISNULL(Loader,0)),AssistantOfficer=Sum(ISNULL(AssistantOfficer,0)),GeneralPackingMan=Sum(ISNULL(GeneralPackingMan,0)),FinishingAssistant=Sum(ISNULL(FinishingAssistant,0)),AssistantCutterMan=Sum(ISNULL(AssistantCutterMan,0)),IronMan=Sum(ISNULL(IronMan,0)),SampleMachinist=Sum(ISNULL(SampleMachinist,0)),Cleaner=Sum(ISNULL(Cleaner,0))
      into ##tblSewing{0}
      from ##tbl2{0}
      Group by  CompanyId,CompanyName,UnitId,UnitName,DepartmentId,WorkDay,SectionId,SectionName

      -----------Production Data
	    SELECT WorkDay=A.ProductionDate,u.CompanyId,A.UnitId,L.PreviousId AS SectionId
	    ,ISNULL(SUM(D.Qty*S.CMFactoryTK),0) AS Earn,SUM(D.Qty) ProdQty,p.BuyerName,p.StyleNo,p.Item
	    Into ##tblProduction{0}
	    FROM ProductionManagementLive.dbo.HourlyProduction A
	    LEFT JOIN ProductionManagementLive.dbo.HourlyProductionDetail D ON D.HourlyProductionId=A.Id
	    LEFT JOIN ProductionManagementLive.dbo.LineNew L ON L.LineId=A.LineId
	    LEFT JOIN ProductionManagementLive.dbo.CP_Style S ON S.Id=A.StyleId
	    LEFT JOIN ProductionManagementLive.dbo.Unit u on u.UnitId=A.UnitId
	    LEFT JOIN Factory_ProductionInfo p on p.WorkDay=a.ProductionDate and p.CompanyId=u.CompanyId and p.UnitId=a.UnitId and p.SectionId=l.PreviousId
	    --where ProductionDate Between '21-Dec-2020' And '21-Dec-2020' AND U.CompanyId=14 and A.UnitId In(16,39)
        {3}
	    GROUP BY  A.ProductionDate,u.CompanyId,p.BuyerName,p.StyleNo,p.Item
	    ,A.UnitId
	    ,L.PreviousId
      -----------End Production

	   Select a.CompanyId,CompanyName=e.ShortName,a.UnitId,UnitName=d.UnitShortName,DepartmentId,WorkDay=FORMAT(a.WorkDay,'dd-MMM-yyyy'),a.SectionId,SectionName=REPLACE(SectionName,' ',''),Salary,
	    D_ComOTAmount,D_EXOTAmount,TiffinAmount,HolidayAmount,NightAmount,
	    LineChief,Supervisor,Operator,Helper,AssistantCutterMan,JuniorIronman,FinishingAssistant,Quality,IronMan,Cleaner,GeneratorOperator,SampleMachinist,Loader,AssistantOfficer,GeneralPackingMan,InputMan,
	    PowerUtilities=b.PowerUtilities/ISNULL(md.DayCount,25),RepairMtnSpares=b.RepairMtnSpares/ISNULL(md.DayCount,25),CarriageTransFreights=b.CarriageTransFreights/ISNULL(md.DayCount,25),IndirectMaterialServices=b.IndirectMaterialServices/ISNULL(md.DayCount,25),	
	    ConveyEntertainStationeryOthers=b.ConveyEntertainStationeryOthers/ISNULL(md.DayCount,25),TotalRents=b.TotalRents/ISNULL(md.DayCount,25),LocalCommissionTradePromotion=b.LocalCommissionTradePromotion/ISNULL(md.DayCount,25),	
	    FactoryOHincludingZonalExp=b.FactoryOHincludingZonalExp/ISNULL(md.DayCount,25),HeadOfficeOverhead=b.HeadOfficeOverhead/ISNULL(md.DayCount,25),DepreciationFactory=b.DepreciationFactory/ISNULL(md.DayCount,25),TTL=b.TTL/ISNULL(md.DayCount,25),TotalMis=b.TotalMis/ISNULL(md.DayCount,25),
	    c.BuyerName,c.StyleNo,c.Item,
	    c.ProdQty,c.Earn
		into ##tblSewingRawData{0}
	    from ##tblSewing{0} a
	    left join ##tblMisCost1{0} b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
	    left join ##tblProduction{0} c on c.CompanyId=a.CompanyId and c.UnitId=a.UnitId and c.SectionId=a.SectionId and c.WorkDay=a.WorkDay
        LEFT JOIN ProductionManagementLive.dbo.Unit d ON d.UnitId=a.UnitId
		LEFT JOIN ProductionManagementLive.dbo.Company e ON e.CompanyId=a.CompanyId
        LEFT JOIN ProductionManagementLive.dbo.MISCostDayCount md ON md.[Month] = MONTH(a.WorkDay) AND md.[YEAR] = YEAR(a.WorkDay)

        declare @DayCount int
		select @DayCount=Count(distinct WorkDay) from ##tblSewingRawData{0}

		select CompanyId,CompanyName,UnitId,UnitName,DepartmentId,SectionId,SectionName,WorkDay,Salary,
	    ComOT=D_ComOTAmount,EXOT=D_EXOTAmount,TA=TiffinAmount,HA=HolidayAmount,NA=NightAmount,
	    LC=LineChief,SV=Supervisor,OP=Operator,HLPR=Helper,ACM=AssistantCutterMan,
		JIM=JuniorIronman,FA=FinishingAssistant,QLTY=Quality,IRM=IronMan,CLNR=Cleaner,GOP=GeneratorOperator,SM=SampleMachinist,LDR=Loader,AO=AssistantOfficer,GPM=GeneralPackingMan,INM=InputMan,
	    PU=PowerUtilities,RMS=RepairMtnSpares,CTF=CarriageTransFreights,IMS=IndirectMaterialServices,	
	    CESO=ConveyEntertainStationeryOthers,TR=TotalRents,LCTP=LocalCommissionTradePromotion,	
	    FOHZE=FactoryOHincludingZonalExp,HOO=HeadOfficeOverhead,DF=DepreciationFactory,TTL,TotalMis,
	    BuyerName,StyleNo,Item,
	    ProdQty,Earn ,SL=0
		from ##tblSewingRawData{0}

        --SELECT * FROM PropertyShortName

		UNION ALL

		Select  
		CompanyId,CompanyName,UnitId,UnitName,DepartmentId=0,SectionId=0,SectionName='UnitWise',WorkDay,Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    LineChief=sum(LineChief),Supervisor=sum(Supervisor),Operator=sum(Operator),Helper=sum(Helper),AssistantCutterMan=sum(AssistantCutterMan),JuniorIronman=sum(JuniorIronman),
		FinishingAssistant=sum(FinishingAssistant),Quality=sum(Quality),IronMan=sum(IronMan),Cleaner=sum(Cleaner),GeneratorOperator=sum(GeneratorOperator),SampleMachinist=sum(SampleMachinist),Loader=sum(Loader),AssistantOfficer=sum(AssistantOfficer),GeneralPackingMan=sum(GeneralPackingMan),InputMan=sum(InputMan),
	    PowerUtilities=sum(PowerUtilities),RepairMtnSpares=sum(RepairMtnSpares),CarriageTransFreights=sum(CarriageTransFreights),IndirectMaterialServices=sum(IndirectMaterialServices),	
	    ConveyEntertainStationeryOthers=sum(ConveyEntertainStationeryOthers),TotalRents=sum(TotalRents),LocalCommissionTradePromotion=sum(LocalCommissionTradePromotion),	
	    FactoryOHincludingZonalExp=sum(FactoryOHincludingZonalExp),HeadOfficeOverhead=sum(HeadOfficeOverhead),DepreciationFactory=sum(DepreciationFactory),TTL=sum(TTL),TotalMis=sum(TotalMis),
	    BuyerName='',StyleNo='',Item='',
	    ProdQty=sum(ProdQty),Earn=sum(Earn),SL=1
		from ##tblSewingRawData{0}
		Group By CompanyId,CompanyName,UnitId,UnitName,WorkDay

		UNION ALL

		Select  
		CompanyId,CompanyName,UnitId=0,UnitName='',DepartmentId=0,SectionId=0,SectionName='CompanyWise',WorkDay,Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    LineChief=sum(LineChief),Supervisor=sum(Supervisor),Operator=sum(Operator),Helper=sum(Helper),AssistantCutterMan=sum(AssistantCutterMan),JuniorIronman=sum(JuniorIronman),
		FinishingAssistant=sum(FinishingAssistant),Quality=sum(Quality),IronMan=sum(IronMan),Cleaner=sum(Cleaner),GeneratorOperator=sum(GeneratorOperator),SampleMachinist=sum(SampleMachinist),Loader=sum(Loader),AssistantOfficer=sum(AssistantOfficer),GeneralPackingMan=sum(GeneralPackingMan),InputMan=sum(InputMan),
	    PowerUtilities=sum(PowerUtilities),RepairMtnSpares=sum(RepairMtnSpares),CarriageTransFreights=sum(CarriageTransFreights),IndirectMaterialServices=sum(IndirectMaterialServices),	
	    ConveyEntertainStationeryOthers=sum(ConveyEntertainStationeryOthers),TotalRents=sum(TotalRents),LocalCommissionTradePromotion=sum(LocalCommissionTradePromotion),	
	    FactoryOHincludingZonalExp=sum(FactoryOHincludingZonalExp),HeadOfficeOverhead=sum(HeadOfficeOverhead),DepreciationFactory=sum(DepreciationFactory),TTL=sum(TTL),TotalMis=sum(TotalMis),
	    BuyerName='',StyleNo='',Item='',
	    ProdQty=sum(ProdQty),Earn=sum(Earn),SL=2
		from ##tblSewingRawData{0}
		Group By CompanyId,CompanyName,WorkDay

		UNION ALL

		Select  
		CompanyId='',CompanyName='',UnitId=0,UnitName='',DepartmentId=0,SectionId=0,SectionName='GrandTotal',WorkDay,Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    LineChief=sum(LineChief),Supervisor=sum(Supervisor),Operator=sum(Operator),Helper=sum(Helper),AssistantCutterMan=sum(AssistantCutterMan),JuniorIronman=sum(JuniorIronman),
		FinishingAssistant=sum(FinishingAssistant),Quality=sum(Quality),IronMan=sum(IronMan),Cleaner=sum(Cleaner),GeneratorOperator=sum(GeneratorOperator),SampleMachinist=sum(SampleMachinist),Loader=sum(Loader),AssistantOfficer=sum(AssistantOfficer),GeneralPackingMan=sum(GeneralPackingMan),InputMan=sum(InputMan),
	    PowerUtilities=sum(PowerUtilities),RepairMtnSpares=sum(RepairMtnSpares),CarriageTransFreights=sum(CarriageTransFreights),IndirectMaterialServices=sum(IndirectMaterialServices),	
	    ConveyEntertainStationeryOthers=sum(ConveyEntertainStationeryOthers),TotalRents=sum(TotalRents),LocalCommissionTradePromotion=sum(LocalCommissionTradePromotion),	
	    FactoryOHincludingZonalExp=sum(FactoryOHincludingZonalExp),HeadOfficeOverhead=sum(HeadOfficeOverhead),DepreciationFactory=sum(DepreciationFactory),TTL=sum(TTL),TotalMis=sum(TotalMis),
	    BuyerName='',StyleNo='',Item='',
	    ProdQty=sum(ProdQty),Earn=sum(Earn),SL=3
		from ##tblSewingRawData{0}
		Group By WorkDay

        UNION ALL

	    Select  
		CompanyId,CompanyName,UnitId,UnitName,DepartmentId=0,SectionId,SectionName,WorkDay='',Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    LineChief=sum(LineChief)/@DayCount,Supervisor=sum(Supervisor)/@DayCount,Operator=sum(Operator)/@DayCount,Helper=sum(Helper)/@DayCount,AssistantCutterMan=sum(AssistantCutterMan)/@DayCount,JuniorIronman=sum(JuniorIronman)/@DayCount,
		FinishingAssistant=sum(FinishingAssistant)/@DayCount,Quality=sum(Quality)/@DayCount,IronMan=sum(IronMan)/@DayCount,Cleaner=sum(Cleaner)/@DayCount,GeneratorOperator=sum(GeneratorOperator)/@DayCount,SampleMachinist=sum(SampleMachinist)/@DayCount,
        Loader=sum(Loader)/@DayCount,AssistantOfficer=sum(AssistantOfficer)/@DayCount,GeneralPackingMan=sum(GeneralPackingMan)/@DayCount,InputMan=sum(InputMan)/@DayCount,
	    PowerUtilities=sum(PowerUtilities),RepairMtnSpares=sum(RepairMtnSpares),CarriageTransFreights=sum(CarriageTransFreights),IndirectMaterialServices=sum(IndirectMaterialServices),	
	    ConveyEntertainStationeryOthers=sum(ConveyEntertainStationeryOthers),TotalRents=sum(TotalRents),LocalCommissionTradePromotion=sum(LocalCommissionTradePromotion),	
	    FactoryOHincludingZonalExp=sum(FactoryOHincludingZonalExp),HeadOfficeOverhead=sum(HeadOfficeOverhead),DepreciationFactory=sum(DepreciationFactory),TTL=sum(TTL),TotalMis=sum(TotalMis),
	    BuyerName='',StyleNo='',Item='',
	    ProdQty=sum(ProdQty),Earn=sum(Earn),SL=4
		from ##tblSewingRawData{0}
		Group By CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName

		UNION ALL
		
		Select  
		CompanyId,CompanyName,UnitId,UnitName,DepartmentId=0,SectionId=0,SectionName='',WorkDay='',Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    LineChief=sum(LineChief)/@DayCount,Supervisor=sum(Supervisor)/@DayCount,Operator=sum(Operator)/@DayCount,Helper=sum(Helper)/@DayCount,AssistantCutterMan=sum(AssistantCutterMan)/@DayCount,JuniorIronman=sum(JuniorIronman)/@DayCount,
		FinishingAssistant=sum(FinishingAssistant)/@DayCount,Quality=sum(Quality)/@DayCount,IronMan=sum(IronMan)/@DayCount,Cleaner=sum(Cleaner)/@DayCount,GeneratorOperator=sum(GeneratorOperator)/@DayCount,SampleMachinist=sum(SampleMachinist)/@DayCount,
        Loader=sum(Loader)/@DayCount,AssistantOfficer=sum(AssistantOfficer)/@DayCount,GeneralPackingMan=sum(GeneralPackingMan)/@DayCount,InputMan=sum(InputMan)/@DayCount,
	    PowerUtilities=sum(PowerUtilities),RepairMtnSpares=sum(RepairMtnSpares),CarriageTransFreights=sum(CarriageTransFreights),IndirectMaterialServices=sum(IndirectMaterialServices),	
	    ConveyEntertainStationeryOthers=sum(ConveyEntertainStationeryOthers),TotalRents=sum(TotalRents),LocalCommissionTradePromotion=sum(LocalCommissionTradePromotion),	
	    FactoryOHincludingZonalExp=sum(FactoryOHincludingZonalExp),HeadOfficeOverhead=sum(HeadOfficeOverhead),DepreciationFactory=sum(DepreciationFactory),TTL=sum(TTL),TotalMis=sum(TotalMis),
	    BuyerName='',StyleNo='',Item='',
	    ProdQty=sum(ProdQty),Earn=sum(Earn),SL=5
		from ##tblSewingRawData{0}
		Group By CompanyId,CompanyName,UnitId,UnitName

		UNION ALL
		
		Select  
		CompanyId,CompanyName,UnitId=0,UnitName='',DepartmentId=0,SectionId=0,SectionName='',WorkDay='',Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    LineChief=sum(LineChief)/@DayCount,Supervisor=sum(Supervisor)/@DayCount,Operator=sum(Operator)/@DayCount,Helper=sum(Helper)/@DayCount,AssistantCutterMan=sum(AssistantCutterMan)/@DayCount,JuniorIronman=sum(JuniorIronman)/@DayCount,
		FinishingAssistant=sum(FinishingAssistant)/@DayCount,Quality=sum(Quality)/@DayCount,IronMan=sum(IronMan)/@DayCount,Cleaner=sum(Cleaner)/@DayCount,GeneratorOperator=sum(GeneratorOperator)/@DayCount,SampleMachinist=sum(SampleMachinist)/@DayCount,
        Loader=sum(Loader)/@DayCount,AssistantOfficer=sum(AssistantOfficer)/@DayCount,GeneralPackingMan=sum(GeneralPackingMan)/@DayCount,InputMan=sum(InputMan)/@DayCount,
	    PowerUtilities=sum(PowerUtilities),RepairMtnSpares=sum(RepairMtnSpares),CarriageTransFreights=sum(CarriageTransFreights),IndirectMaterialServices=sum(IndirectMaterialServices),	
	    ConveyEntertainStationeryOthers=sum(ConveyEntertainStationeryOthers),TotalRents=sum(TotalRents),LocalCommissionTradePromotion=sum(LocalCommissionTradePromotion),	
	    FactoryOHincludingZonalExp=sum(FactoryOHincludingZonalExp),HeadOfficeOverhead=sum(HeadOfficeOverhead),DepreciationFactory=sum(DepreciationFactory),TTL=sum(TTL),TotalMis=sum(TotalMis),
	    BuyerName='',StyleNo='',Item='',
	    ProdQty=sum(ProdQty),Earn=sum(Earn),SL=6
		from ##tblSewingRawData{0}
		Group By CompanyId,CompanyName

        UNION ALL
		
		Select  
		CompanyId=0,CompanyName='',UnitId=0,UnitName='',DepartmentId=0,SectionId=0,SectionName='',WorkDay='',Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    LineChief=sum(LineChief)/@DayCount,Supervisor=sum(Supervisor)/@DayCount,Operator=sum(Operator)/@DayCount,Helper=sum(Helper)/@DayCount,AssistantCutterMan=sum(AssistantCutterMan)/@DayCount,JuniorIronman=sum(JuniorIronman)/@DayCount,
		FinishingAssistant=sum(FinishingAssistant)/@DayCount,Quality=sum(Quality)/@DayCount,IronMan=sum(IronMan)/@DayCount,Cleaner=sum(Cleaner)/@DayCount,GeneratorOperator=sum(GeneratorOperator)/@DayCount,SampleMachinist=sum(SampleMachinist)/@DayCount,
        Loader=sum(Loader)/@DayCount,AssistantOfficer=sum(AssistantOfficer)/@DayCount,GeneralPackingMan=sum(GeneralPackingMan)/@DayCount,InputMan=sum(InputMan)/@DayCount,
	    PowerUtilities=sum(PowerUtilities),RepairMtnSpares=sum(RepairMtnSpares),CarriageTransFreights=sum(CarriageTransFreights),IndirectMaterialServices=sum(IndirectMaterialServices),	
	    ConveyEntertainStationeryOthers=sum(ConveyEntertainStationeryOthers),TotalRents=sum(TotalRents),LocalCommissionTradePromotion=sum(LocalCommissionTradePromotion),	
	    FactoryOHincludingZonalExp=sum(FactoryOHincludingZonalExp),HeadOfficeOverhead=sum(HeadOfficeOverhead),DepreciationFactory=sum(DepreciationFactory),TTL=sum(TTL),TotalMis=sum(TotalMis),
	    BuyerName='',StyleNo='',Item='',
	    ProdQty=sum(ProdQty),Earn=sum(Earn),SL=7
		from ##tblSewingRawData{0}
		
		order by SL

	    drop table ##tbl1{0}
	    drop table ##tbl2{0}
	    drop table ##tblSewing{0}
	    drop table ##tblCompWiseLine{0}
	    drop table ##tblUnitWiseLineCount{0}
	    drop table ##tblMisCost{0}
	    drop table ##tblMisCost1{0}
	    drop table ##tblProduction{0}
		drop table ##tblSewingRawData{0}", guidId, condition, compCondition, prodCondition);

            return _common.GetDataTableWithContStr(query, ConnectionString);
        }
        public DataTable GetFactoryManagementData(string conditionMgmt, string condition2, string compcondition)
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");

            string query = string.Format(@"
	       select a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.DepartmentId,a.SectionId,a.SectionName,a.DesigGroup,a.WorkDay,a.SortOrder,
	        CountEmp=Sum(CountEmp),Salary=Sum(Salary),DayTotalCost=Sum(DayTotalCost),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),
	        TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount) 
	        into ##tbl3{1}
	        from DeptWiseDailyData  a
			inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
            {0}
	        Group by a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.DepartmentId,a.SectionId,a.SectionName,a.DesigGroup,a.WorkDay,a.SortOrder
	        Order by a.SortOrder

            --Desig type Wise Manpower
	        Select pv.* 
	        into ##tbl4{1}
	        From
	        ( 
	        Select * From (
	        Select CompanyId,UnitId,UnitName,DepartmentId,WorkDay,SectionId, DesigGroup,CountEmp,
            Salary,D_ComOTAmount,D_EXOTAmount,TiffinAmount,HolidayAmount,NightAmount 
            From ##tbl3{1}
	        ) sal
	        PIVOT (SUM(CountEmp)for DesigGroup in([ExecutiveDirector],[GeneralManager],[Manager],[ProductionManager],[IE]) )As p 
	        )pv

	        select CompanyId,UnitId,WorkDay,Salary=Sum(ISNULL(Salary,0)),
            D_ComOTAmount=Sum(ISNULL(D_ComOTAmount,0)),D_EXOTAmount=Sum(ISNULL(D_EXOTAmount,0)),TiffinAmount=Sum(ISNULL(TiffinAmount,0)),HolidayAmount=Sum(ISNULL(HolidayAmount,0)),NightAmount=Sum(ISNULL(NightAmount,0)),
	        ED=Sum(ISNULL([ExecutiveDirector],0)),
	        GM=Sum(ISNULL([GeneralManager],0)),
	        Manager=Sum(ISNULL(Manager,0)),
            PM=Sum(ISNULL([ProductionManager],0)),
            IE=Sum(ISNULL(IE,0))
	        into ##tbl5{1}
	        from ##tbl4{1}
	        Group by  CompanyId,UnitId,WorkDay

	         --For Getting All Line By Unit
	        select distinct a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.DepartmentId,a.SectionId,a.SectionName
	        into ##tblCompWiseLine{1}
	        from DeptWiseDailyData a
			inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
            {2}
	        Group by a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.DepartmentId,a.SectionId,a.SectionName,a.DesigGroup,a.SortOrder

             --For Getting All Line By Workday
	        select distinct a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.DepartmentId,a.SectionId,a.SectionName,a.WorkDay
	        into ##tblWorkDayWiseLine{1}
	        from DeptWiseDailyData a
			inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
            {2}
	       Group by a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.DepartmentId,a.SectionId,a.SectionName,a.DesigGroup,a.WorkDay,a.SortOrder

		        --Comp Line Count
	        select a.CompanyId,a.UnitId,WorkDay,LineCount=COUNT(distinct a.SectionId) 
	        into ##tblUnitWiseLineCount{1}
	        from ##tblWorkDayWiseLine{1} a
            {3}
	        GROUP BY a.CompanyId,a.UnitId,UnitName,WorkDay

	        --Comp Unit Count
	        --select CompanyId,UnitCount=count(distinct UnitId) 
	        --into ##tblCompWiseUnitCount{1}
	        --from ##tblUnitWiseLineCount{1}
	        --GROUP BY CompanyId

	        select a.CompanyId,CompanyName=g.ShortName,a.UnitId,UnitName=f.UnitShortName, a.SectionId,SectionName=REPLACE(a.SectionName,' ',''),WorkDay=FORMAT(e.WorkDay,'dd-MMM-yyyy')
	       ,Salary=cast((e.Salary/cast(c.LineCount as decimal))as decimal(18,10))
            ,D_ComOTAmount=cast((e.D_ComOTAmount/cast(c.LineCount as decimal))as decimal(18,10))
			,D_EXOTAmount=cast((e.D_EXOTAmount/cast(c.LineCount as decimal))as decimal(18,10))
			,TiffinAmount=cast((e.TiffinAmount/cast(c.LineCount as decimal))as decimal(18,10))
			,HolidayAmount=cast((e.HolidayAmount/cast(c.LineCount as decimal))as decimal(18,10))
			,NightAmount=cast((e.NightAmount/cast(c.LineCount as decimal))as decimal(18,10))
	        ,ED=cast((e.ED/cast(c.LineCount as decimal))as decimal(18,10))
	        ,GM=cast((e.GM/cast(c.LineCount as decimal))as decimal(18,10))
	        ,Manager=cast((e.Manager/cast(c.LineCount as decimal))as decimal(18,10))
            ,PM=cast((e.PM/cast(c.LineCount as decimal))as decimal(18,10))
            ,IE=cast((e.IE/cast(c.LineCount as decimal))as decimal(18,10))
            into ##tblManagementRawData{1}
	        from ##tblWorkDayWiseLine{1} a
	        INNER JOIN ##tblUnitWiseLineCount{1} c on c.CompanyId=a.CompanyId and c.UnitId=a.UnitId and c.WorkDay=a.WorkDay
	        INNER JOIN ##tbl5{1} e on e.CompanyId=a.CompanyId and e.UnitId=a.UnitId and e.WorkDay=a.WorkDay
            LEFT JOIN ProductionManagementLive.dbo.Unit f ON f.UnitId=a.UnitId
			LEFT JOIN ProductionManagementLive.dbo.Company g ON g.CompanyId=a.CompanyId
            {3}

            declare @DayCount int
		    select @DayCount=Count(distinct WorkDay) from ##tblManagementRawData{1}

             Select CompanyId,CompanyName,UnitId,UnitName, SectionId,SectionName,WorkDay,
             Salary,ComOT=D_ComOTAmount,EXOT=D_EXOTAmount,TA=TiffinAmount,HA=HolidayAmount,NA=NightAmount,
             ED,GM,MGR=Manager,PM,IE, SL=0
			 from ##tblManagementRawData{1}

			 UNION ALL

			 Select CompanyId,CompanyName,UnitId,UnitName, SectionId=0,SectionName='UnitWise',WorkDay,
            Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
            ED=Sum(ED),GM=Sum(GM),Manager=Sum(Manager),PM=Sum(PM),IE=Sum(IE),SL=1
			 from ##tblManagementRawData{1}
			 Group By CompanyId,CompanyName,UnitId,UnitName,WorkDay

			 UNION ALL

			 Select CompanyId,CompanyName,UnitId=0,UnitName='', SectionId=0,SectionName='CompanyWise',WorkDay,
            Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
            ED=Sum(ED),GM=Sum(GM),Manager=Sum(Manager),PM=Sum(PM),IE=Sum(IE),SL=2
			 from ##tblManagementRawData{1}
			 Group By CompanyId,CompanyName,WorkDay

			 UNION ALL

			 Select CompanyId=0,CompanyName='',UnitId=0,UnitName='', SectionId=0,SectionName='GrandTotal',WorkDay,
             Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
             ED=Sum(ED),GM=Sum(GM),Manager=Sum(Manager),PM=Sum(PM),IE=Sum(IE),SL=3
			 from ##tblManagementRawData{1}
			 Group By WorkDay
            UNION ALL

			 Select CompanyId,CompanyName,UnitId,UnitName, SectionId,SectionName,WorkDay='',
             Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
             ED=Sum(ED)/@DayCount,GM=Sum(GM)/@DayCount,Manager=SUM(Manager)/@DayCount,PM=Sum(PM)/@DayCount,IE=Sum(IE)/@DayCount,SL=4
			 from ##tblManagementRawData{1}
			 Group By CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName

			 UNION ALL

			 Select CompanyId,CompanyName,UnitId,UnitName, SectionId=0,SectionName='',WorkDay='',
             Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
             ED=Sum(ED)/@DayCount,GM=Sum(GM)/@DayCount,Manager=SUM(Manager)/@DayCount,PM=Sum(PM)/@DayCount,IE=Sum(IE)/@DayCount,SL=5
			 from ##tblManagementRawData{1}
			 Group By CompanyId,CompanyName,UnitId,UnitName

			 UNION ALL

			 Select CompanyId,CompanyName,UnitId=0,UnitName='', SectionId=0,SectionName='',WorkDay='',
             Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
             ED=Sum(ED)/@DayCount,GM=Sum(GM)/@DayCount,Manager=SUM(Manager)/@DayCount,PM=Sum(PM)/@DayCount,IE=Sum(IE)/@DayCount,SL=6
			 from ##tblManagementRawData{1}
			 Group By CompanyId,CompanyName

			  UNION ALL

			 Select CompanyId=0,CompanyName='',UnitId=0,UnitName='', SectionId=0,SectionName='',WorkDay='',
             Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
             ED=Sum(ED)/@DayCount,GM=Sum(GM)/@DayCount,Manager=SUM(Manager)/@DayCount,PM=Sum(PM)/@DayCount,IE=Sum(IE)/@DayCount,SL=7
			 from ##tblManagementRawData{1}

             ORDER BY SL

	        drop table ##tbl3{1}
	        drop table ##tbl4{1}
	        drop table ##tbl5{1}
	        drop table ##tblCompWiseLine{1}
	        drop table ##tblUnitWiseLineCount{1}
            drop table ##tblManagementRawData{1}
			drop table ##tblWorkdayWiseLine{1}", conditionMgmt, guidId, condition2, compcondition);

            return _common.GetDataTableWithContStr(query, ConnectionString);
        }
        public DataTable GetFactoryFinishingData(string conditionFin, string condition2, string compCondition)
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");

            string query = string.Format(@" 
	        select distinct a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.DepartmentId,a.SectionId,a.SectionName,a.WorkDay
	        into ##tblCompWiseLine{3}
	        from DeptWiseDailyData a
			inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
            {1} AND isnull(b.ParentUnitId,0)>0 AND b.IsActive=1
	        Group by a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.DepartmentId,a.SectionId,a.SectionName,a.DesigGroup,a.SortOrder,a.WorkDay

		    --Comp Line Count
	        select a.CompanyId,a.UnitId,a.WorkDay,LineCount=COUNT(distinct a.SectionId) 
	        into ##tblUnitWiseLineCount{3}
	        from ##tblCompWiseLine{3} a
            {2}
	        GROUP BY a.CompanyId,a.UnitId,a.WorkDay

	
	        select a.CompanyId,a.UnitId,DepartmentId,SectionId,DesigGroup='Finishing',WorkDay,SortOrder,
	        CountEmp=Sum(CountEmp),Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),
	        TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount) 
	        into ##tbl6{3}
	        from DeptWiseDailyData a
			left join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
            {0} And isnull(b.ParentUnitId,0)>0 AND b.IsActive=1
	         Group by a.CompanyId,a.UnitId,DepartmentId,SectionId,DesigGroup,WorkDay,SortOrder
	        Order by SortOrder

          ---Desig type Wise Manpower
	        Select pv.* 
	        into ##tbl7{3}
	        From
	        ( 
	        Select * From (
	        Select CompanyId,UnitId,DepartmentId,WorkDay,SectionId, DesigGroup,CountEmp,Salary,D_ComOTAmount,D_EXOTAmount,TiffinAmount,HolidayAmount,NightAmount From ##tbl6{3}
	        ) sal
	        PIVOT (SUM(CountEmp)for DesigGroup in([Finishing]) )As p 
	        )pv

	        select CompanyId,UnitId,WorkDay,Salary=Sum(ISNULL(Salary,0)),
            D_ComOTAmount=Sum(ISNULL(D_ComOTAmount,0)),D_EXOTAmount=Sum(ISNULL(D_EXOTAmount,0)),
	        TiffinAmount=Sum(ISNULL(TiffinAmount,0)),HolidayAmount=Sum(ISNULL(HolidayAmount,0)),NightAmount=Sum(ISNULL(NightAmount,0)), 
	        Finishing=Sum(ISNULL(Finishing,0))
            into ##tbl8{3}
	        from ##tbl7{3}
	        Group by  CompanyId,UnitId,WorkDay

	       select a.CompanyId,CompanyName=g.ShortName,a.UnitId,UnitName=f.UnitShortName,a.SectionId,SectionName=REPLACE(a.SectionName,' ',''),WorkDay=FORMAT(e.WorkDay,'dd-MMM-yyyy')
	        ,Salary=cast((e.Salary/cast(c.LineCount as decimal))as decimal(18,10))
            ,D_ComOTAmount=cast((e.D_ComOTAmount/cast(c.LineCount as decimal))as decimal(18,10))
            ,D_EXOTAmount=cast((e.D_EXOTAmount/cast(c.LineCount as decimal))as decimal(18,10))
            ,TiffinAmount=cast((e.TiffinAmount/cast(c.LineCount as decimal))as decimal(18,10))
            ,HolidayAmount=cast((e.HolidayAmount/cast(c.LineCount as decimal))as decimal(18,10))
            ,NightAmount=cast((e.NightAmount/cast(c.LineCount as decimal))as decimal(18,10))
            ,Finishing=cast((e.Finishing/cast(c.LineCount as decimal))as decimal(18,10))
            into ##tblFinishingRawData{3}
	        from ##tblCompWiseLine{3} a
	        INNER JOIN ##tblUnitWiseLineCount{3} c on c.CompanyId=a.CompanyId and c.UnitId=a.UnitId and a.WorkDay=c.WorkDay
	        INNER JOIN ##tbl8{3} e on e.CompanyId=a.CompanyId and e.UnitId=a.UnitId and e.WorkDay=a.WorkDay
            LEFT JOIN ProductionManagementLive.dbo.Unit f ON f.UnitId=a.UnitId
		    LEFT JOIN ProductionManagementLive.dbo.Company g ON g.CompanyId=a.CompanyId
            {2}

            declare @DayCount int
		    select @DayCount=Count(distinct WorkDay) from ##tblFinishingRawData{3}

            SELECT CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,WorkDay,
			 Salary,ComOT=D_ComOTAmount,EXOT=D_EXOTAmount,TA=TiffinAmount,HA=HolidayAmount,NA=NightAmount,
            Finishing,SL=0
			 FROM ##tblFinishingRawData{3}

			 UNION ALL

			 Select CompanyId,CompanyName,UnitId,UnitName,SectionId=0,SectionName='UnitWise',WorkDay,
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Finishing=SUM(Finishing), SL=1
			 from ##tblFinishingRawData{3}
			 GROUP BY CompanyId,CompanyName,UnitId,UnitName,WorkDay

			 UNION ALL

			 Select CompanyId,CompanyName,UnitId=0,UnitName='',SectionId=0,SectionName='CompanyWise',WorkDay,
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Finishing=SUM(Finishing), SL=2
			 from ##tblFinishingRawData{3}
			 GROUP BY CompanyId,CompanyName,WorkDay

			  UNION ALL

			 Select CompanyId=0,CompanyName='',UnitId=0,UnitName='',SectionId=0,SectionName='GrandTotal',WorkDay,
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Finishing=SUM(Finishing), SL=3
			 from ##tblFinishingRawData{3}
			 GROUP BY WorkDay
			  UNION ALL

			 Select CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,WorkDay='',
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Finishing=SUM(Finishing)/@DayCount, SL=4
			 from ##tblFinishingRawData{3}
			 GROUP BY CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName

			 UNION ALL

			 Select CompanyId,CompanyName,UnitId,UnitName,SectionId=0,SectionName='',WorkDay='',
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Finishing=SUM(Finishing)/@DayCount, SL=5
			 from ##tblFinishingRawData{3}
			 GROUP BY CompanyId,CompanyName,UnitId,UnitName

			  UNION ALL

			 Select CompanyId,CompanyName,UnitId=0,UnitName='',SectionId=0,SectionName='',WorkDay='',
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Finishing=SUM(Finishing)/@DayCount, SL=6
			 from ##tblFinishingRawData{3}
			 GROUP BY CompanyId,CompanyName

			  UNION ALL

			 Select CompanyId=0,CompanyName='',UnitId=0,UnitName='',SectionId=0,SectionName='',WorkDay='',
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Finishing=SUM(Finishing)/@DayCount, SL=7
			 from ##tblFinishingRawData{3}
			 ORDER BY SL

			

	        drop table ##tbl6{3}
	        drop table ##tbl7{3}
	        drop table ##tbl8{3}
	        drop table ##tblCompWiseLine{3}
	        drop table ##tblUnitWiseLineCount{3}
            drop table ##tblFinishingRawData{3}", conditionFin, condition2, compCondition, guidId);

            return _common.GetDataTableWithContStr(query, ConnectionString);
        }
        public DataTable GetFactoryCuttingData(string conditionCut, string condition2, string compCondition)
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");

            string query = string.Format(@" 
	         select distinct a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.DepartmentId,a.SectionId,a.SectionName,a.WorkDay
	        into ##tblCompWiseLine{3}
	        from DeptWiseDailyData a
			inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
            {1} AND isnull(b.ParentUnitId,0)>0 AND b.IsActive=1
	        Group by a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.DepartmentId,a.SectionId,a.SectionName,a.WorkDay,a.DesigGroup,a.SortOrder

		    --Comp Line Count
	         select a.CompanyId,a.UnitId,a.WorkDay,LineCount=COUNT(distinct a.SectionId) 
	        into ##tblUnitWiseLineCount{3}
	        from ##tblCompWiseLine{3} a
            {2}
	          GROUP BY a.CompanyId,a.UnitId,a.WorkDay

	   
	        select a.CompanyId,a.UnitId,DepartmentId,SectionId,DesigGroup='Cutting',WorkDay,SortOrder,
	        CountEmp=Sum(CountEmp),Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),
	        TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount) 
	        into ##tbl6{3}
	        from DeptWiseDailyData a
			left join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
	        --where WorkDay='21-Dec-2020' and CompanyId=14 and DepartmentName Like 'CUT%'
            {0} And isnull(b.ParentUnitId,0)>0 AND b.IsActive=1 
	        Group by a.CompanyId,a.UnitId,DepartmentId,SectionId,DesigGroup,WorkDay,SortOrder
	        Order by SortOrder


          ---Desig type Wise Manpower
	        Select pv.* 
	        into ##tbl7{3}
	        From
	        ( 
	        Select * From (
	        Select CompanyId,UnitId,DepartmentId,WorkDay,SectionId, DesigGroup,CountEmp,Salary,D_ComOTAmount,D_EXOTAmount,TiffinAmount,HolidayAmount,NightAmount From ##tbl6{3}
	        ) sal
	        PIVOT (SUM(CountEmp)for DesigGroup in([Cutting]) )As p 
	        )pv

	        select CompanyId,UnitId,WorkDay,Salary=Sum(ISNULL(Salary,0)),
            D_ComOTAmount=Sum(ISNULL(D_ComOTAmount,0)),D_EXOTAmount=Sum(ISNULL(D_EXOTAmount,0)),
	        TiffinAmount=Sum(ISNULL(TiffinAmount,0)),HolidayAmount=Sum(ISNULL(HolidayAmount,0)),NightAmount=Sum(ISNULL(NightAmount,0)), 
            Cutting=Sum(ISNULL(Cutting,0))
            into ##tbl8{3}
	        from ##tbl7{3}
	        Group by  CompanyId,UnitId,WorkDay

	        select a.CompanyId,CompanyName=g.ShortName,a.UnitId,UnitName=f.UnitShortName,a.SectionId,SectionName=REPLACE(a.SectionName,' ',''),WorkDay=FORMAT(e.WorkDay,'dd-MMM-yyyy')
	        ,Salary=cast((e.Salary/cast(c.LineCount as decimal))as decimal(18,10))
            ,D_ComOTAmount=cast((e.D_ComOTAmount/cast(c.LineCount as decimal))as decimal(18,10))
            ,D_EXOTAmount=cast((e.D_EXOTAmount/cast(c.LineCount as decimal))as decimal(18,10))
            ,TiffinAmount=cast((e.TiffinAmount/cast(c.LineCount as decimal))as decimal(18,10))
            ,HolidayAmount=cast((e.HolidayAmount/cast(c.LineCount as decimal))as decimal(18,10))
            ,NightAmount=cast((e.NightAmount/cast(c.LineCount as decimal))as decimal(18,10))
            ,Cutting=cast((e.Cutting/cast(c.LineCount as decimal))as decimal(18,10))
            into ##tblCuttingRawData{3}
	        from ##tblCompWiseLine{3} a
	        INNER JOIN ##tblUnitWiseLineCount{3} c on c.CompanyId=a.CompanyId and c.UnitId=a.UnitId and a.WorkDay=c.WorkDay
	        INNER JOIN ##tbl8{3} e on e.CompanyId=a.CompanyId and e.UnitId=a.UnitId and e.WorkDay=a.WorkDay
            LEFT JOIN ProductionManagementLive.dbo.Unit f ON f.UnitId=a.UnitId
		    LEFT JOIN ProductionManagementLive.dbo.Company g ON g.CompanyId=a.CompanyId
            {2}

            declare @DayCount int
		    select @DayCount=Count(distinct WorkDay) from ##tblCuttingRawData{3}

              SELECT CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,WorkDay,
			Salary,ComOT=D_ComOTAmount,EXOT=D_EXOTAmount,TA=TiffinAmount,HA=HolidayAmount,NA=NightAmount,
            Cutting, SL=0
			 FROM ##tblCuttingRawData{3}

			 UNION ALL

			 Select CompanyId,CompanyName,UnitId,UnitName,SectionId=0,SectionName='UnitWise',WorkDay,
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Cutting=SUM(Cutting), SL=1
			 from ##tblCuttingRawData{3}
			 GROUP BY CompanyId,CompanyName,UnitId,UnitName,WorkDay

			 UNION ALL

			 Select CompanyId,CompanyName,UnitId=0,UnitName='',SectionId=0,SectionName='CompanyWise',WorkDay,
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Cutting=SUM(Cutting), SL=2
			 from ##tblCuttingRawData{3}
			 GROUP BY CompanyId,CompanyName,WorkDay

			  UNION ALL

			 Select CompanyId=0,CompanyName='',UnitId=0,UnitName='',SectionId=0,SectionName='GrandTotal',WorkDay,
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Cutting=SUM(Cutting), SL=3
			 from ##tblCuttingRawData{3}
			 GROUP BY WorkDay

			  UNION ALL

			 Select CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,WorkDay='',
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Cutting=SUM(Cutting)/@DayCount, SL=4
			 from ##tblCuttingRawData{3}
			 GROUP BY CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName

			  UNION ALL

			 Select CompanyId,CompanyName,UnitId,UnitName,SectionId=0,SectionName='',WorkDay='',
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Cutting=SUM(Cutting)/@DayCount, SL=5
			 from ##tblCuttingRawData{3}
			 GROUP BY CompanyId,CompanyName,UnitId,UnitName

			  UNION ALL

			 Select CompanyId,CompanyName,UnitId=0,UnitName='',SectionId=0,SectionName='',WorkDay='',
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Cutting=SUM(Cutting)/@DayCount, SL=6
			 from ##tblCuttingRawData{3}
			 GROUP BY CompanyId,CompanyName

			  UNION ALL

			 Select CompanyId=0,CompanyName='',UnitId=0,UnitName='',SectionId=0,SectionName='',WorkDay='',
			 Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
			 TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Cutting=SUM(Cutting)/@DayCount, SL=7
			 from ##tblCuttingRawData{3}
			
			 ORDER BY SL
			

	        drop table ##tbl6{3}
	        drop table ##tbl7{3}
	        drop table ##tbl8{3}
	        drop table ##tblCompWiseLine{3}
	        drop table ##tblUnitWiseLineCount{3}
            drop table ##tblCuttingRawData{3}", conditionCut, condition2, compCondition, guidId);

            return _common.GetDataTableWithContStr(query, ConnectionString);
        }

        public DataTable GetFactoryOthersData(string conditionOthers, string condition2, string compCondition)
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");

            string query = string.Format(@" 

		--For Getting All Line By Unit
	 select distinct a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.DepartmentId,a.SectionId,a.SectionName,a.WorkDay
	into ##tblCompWiseLine{3}
	from DeptWiseDailyData a
	inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
    {0} AND isnull(b.ParentUnitId,0)>0 AND b.IsActive=1
	Group by a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.DepartmentId,a.SectionId,a.SectionName,a.WorkDay,a.DesigGroup,a.SortOrder

		--Comp Line Count
	  select a.CompanyId,a.UnitId,a.WorkDay,LineCount=COUNT(distinct a.SectionId) 
	into ##tblUnitWiseLineCount{3}
	from ##tblCompWiseLine{3} a
    {2}
	  GROUP BY a.CompanyId,a.UnitId,a.WorkDay

	
	
	  select a.CompanyId,a.UnitId,DepartmentId,SectionId,DesigGroup='Others',WorkDay,SortOrder,
	CountEmp=Sum(CountEmp),Salary=Sum(Salary),DayTotalCost=Sum(DayTotalCost),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),
	TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount) 
	into ##tbl6{3}
	from DeptWiseDailyData a
	left join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
    {1}
    Group by a.CompanyId,a.UnitId,DepartmentId,SectionId,DesigGroup,WorkDay,SortOrder
	Order by SortOrder

	---Desig type Wise Manpower
	Select pv.* 
	into ##tbl7{3}
	From
	( 
	Select * From (
	Select CompanyId,UnitId,DepartmentId,WorkDay,SectionId, DesigGroup,CountEmp,Salary,D_ComOTAmount,D_EXOTAmount,TiffinAmount,HolidayAmount,NightAmount From ##tbl6{3}
	) sal
	PIVOT (SUM(CountEmp)for DesigGroup in([Others]) )As p 
	)pv

	select CompanyId,UnitId,WorkDay,Salary=Sum(ISNULL(Salary,0)),
	D_ComOTAmount=Sum(ISNULL(D_ComOTAmount,0)),D_EXOTAmount=Sum(ISNULL(D_EXOTAmount,0)),
	TiffinAmount=Sum(ISNULL(TiffinAmount,0)),HolidayAmount=Sum(ISNULL(HolidayAmount,0)),NightAmount=Sum(ISNULL(NightAmount,0)), 	
	Others=Sum(ISNULL(Others,0))
	into ##tbl8{3}
	from ##tbl7{3}
	Group by  CompanyId,UnitId,WorkDay

	 select a.CompanyId,CompanyName=g.ShortName,a.UnitId,UnitName=f.UnitShortName,a.SectionId,SectionName=REPLACE(a.SectionName,' ',''),WorkDay=FORMAT(e.WorkDay,'dd-MMM-yyyy')
    ,Salary=cast((e.Salary/cast(c.LineCount as decimal))as decimal(18,10))
    ,D_ComOTAmount=cast((e.D_ComOTAmount/cast(c.LineCount as decimal))as decimal(18,10))
    ,D_EXOTAmount=cast((e.D_EXOTAmount/cast(c.LineCount as decimal))as decimal(18,10))
    ,TiffinAmount=cast((e.TiffinAmount/cast(c.LineCount as decimal))as decimal(18,10))
    ,HolidayAmount=cast((e.HolidayAmount/cast(c.LineCount as decimal))as decimal(18,10))
    ,NightAmount=cast((e.NightAmount/cast(c.LineCount as decimal))as decimal(18,10))
    ,Others=cast((e.Others/cast(c.LineCount as decimal))as decimal(18,10))
    into ##tblOthersRawData{3}
	from ##tblCompWiseLine{3} a
	INNER JOIN ##tblUnitWiseLineCount{3} c on c.CompanyId=a.CompanyId and c.UnitId=a.UnitId and a.WorkDay=c.WorkDay
	INNER JOIN ##tbl8{3} e on e.CompanyId=a.CompanyId and e.UnitId=a.UnitId and e.WorkDay=a.WorkDay
    LEFT JOIN ProductionManagementLive.dbo.Unit f ON f.UnitId=a.UnitId
	LEFT JOIN ProductionManagementLive.dbo.Company g ON g.CompanyId=a.CompanyId
        {2}

    declare @DayCount int
	select @DayCount=Count(distinct WorkDay) from ##tblOthersRawData{3}

    SELECT CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,WorkDay,
	Salary,ComOT=D_ComOTAmount,EXOT=D_EXOTAmount,TA=TiffinAmount,HA=HolidayAmount,NA=NightAmount,
    Others, SL=0
	FROM ##tblOthersRawData{3}

	UNION ALL

	Select CompanyId,CompanyName,UnitId,UnitName,SectionId=0,SectionName='UnitWise',WorkDay,
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Others=SUM(Others), SL=1
	from ##tblOthersRawData{3}
	GROUP BY CompanyId,CompanyName,UnitId,UnitName,WorkDay

	UNION ALL

	Select CompanyId,CompanyName,UnitId=0,UnitName='',SectionId=0,SectionName='CompanyWise',WorkDay,
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Others=SUM(Others), SL=2
	from ##tblOthersRawData{3}
	GROUP BY CompanyId,CompanyName,WorkDay

	UNION ALL

	Select CompanyId=0,CompanyName='',UnitId=0,UnitName='',SectionId=0,SectionName='GrandTotal',WorkDay,
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Others=SUM(Others), SL=3
	from ##tblOthersRawData{3}
	GROUP BY WorkDay

	UNION ALL

	Select CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,WorkDay='',
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Others=SUM(Others)/@DayCount, SL=4
	from ##tblOthersRawData{3}
	GROUP BY CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName

	UNION ALL

	Select CompanyId,CompanyName,UnitId,UnitName,SectionId=0,SectionName='',WorkDay='',
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Others=SUM(Others)/@DayCount, SL=5
	from ##tblOthersRawData{3}
	GROUP BY CompanyId,CompanyName,UnitId,UnitName

	UNION ALL

	Select CompanyId,CompanyName,UnitId=0,UnitName='',SectionId=0,SectionName='',WorkDay='',
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Others=SUM(Others)/@DayCount, SL=6
	from ##tblOthersRawData{3}
	GROUP BY CompanyId,CompanyName

	UNION ALL

	Select CompanyId=0,CompanyName='',UnitId=0,UnitName='',SectionId=0,SectionName='',WorkDay='',
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Others=SUM(Others)/@DayCount, SL=7
	from ##tblOthersRawData{3}

	ORDER BY SL

	
	drop table ##tbl6{3}
	drop table ##tbl7{3}
	drop table ##tbl8{3}
	drop table ##tblCompWiseLine{3}
	drop table ##tblUnitWiseLineCount{3}
    drop TABLE ##tblOthersRawData{3}
    ", condition2, conditionOthers, compCondition, guidId);

            return _common.GetDataTableWithContStr(query, ConnectionString);
        }
        public DataTable GetFactoryCentralData(string conditionCentral, string condition2, string compCondition, string unitCondition, string dateCondition)
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");

            string query = string.Format(@" 

		--For Getting All Line By Unit
	    select distinct a.CompanyId,CompanyName,a.UnitId,a.UnitName,DepartmentId,SectionId,SectionName,WorkDay
	    into ##tblCompWiseLine{3}
	    from DeptWiseDailyData a
	    inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId 
        {0}
	    Group by a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.DepartmentId,a.SectionId,a.SectionName,a.DesigGroup,a.SortOrder,WorkDay

		--Comp Line Count
	    select a.CompanyId,a.UnitId,WorkDay,LineCount=COUNT(distinct a.SectionId) 
	    into ##tblUnitWiseLineCount{3}
	    from ##tblCompWiseLine{3} a
        inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
        {2} AND isnull(b.ParentUnitId,0)>0 AND b.IsActive=1
	    GROUP BY a.CompanyId,a.UnitId,WorkDay

	--Comp Unit Count
	    select CompanyId,WorkDay,UnitCount=count(distinct UnitId) 
	    into ##tblCompWiseUnitCount{3}
	    from ##tblUnitWiseLineCount{3}
        GROUP BY CompanyId,WorkDay
	
	
	    select a.CompanyId,a.UnitId,DepartmentId,SectionId,DesigGroup='Central',WorkDay,SortOrder,
	    CountEmp=Sum(CountEmp),Salary=Sum(Salary),DayTotalCost=Sum(DayTotalCost),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),
	    TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount) 
	    into ##tbl6{3}
	    from DeptWiseDailyData a
        inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
        {1} AND isnull(b.ParentUnitId,0)=0 AND b.IsActive=1
	    Group by a.CompanyId,a.UnitId,DepartmentId,SectionId,DesigGroup,WorkDay,SortOrder
	    Order by SortOrder

    --TSWL Central
	    select WorkDay,
	    CountEmp=Sum(CountEmp),Salary=Sum(Salary),DayTotalCost=Sum(DayTotalCost),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),
	    TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount) 
	    into ##tblTSWLCentral{3}
	    from DeptWiseDailyData a
        inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
        where 1=1  AND a.CompanyId = 6 AND a.UnitId=14 {5}
	    Group by WorkDay

    --Select WorkDay,
	--CountEmp=(CountEmp-(CountEmp*12/100))/10 ,
	--Salary=(Salary-(Salary*12/100))/10 ,
	--D_ComOTAmount=(D_ComOTAmount-(D_ComOTAmount*12/100))/10 ,
	--D_EXOTAmount=(D_EXOTAmount-(D_EXOTAmount*12/100))/10  ,
	--TiffinAmount=(TiffinAmount-(TiffinAmount*12/100))/10 ,
	--HolidayAmount=(HolidayAmount-(HolidayAmount*12/100))/10,
	--NightAmount=(NightAmount-(NightAmount*12/100))/10
	--into ##tblTSWLCentral1{3}
	--from ##tblTSWLCentral{3} a


    Select WorkDay,
	CountEmp=(CountEmp-(CountEmp*60/100))/10 ,
	Salary=(Salary-(Salary*60/100))/10 ,
	D_ComOTAmount=(D_ComOTAmount-(D_ComOTAmount*60/100))/10 ,
	D_EXOTAmount=(D_EXOTAmount-(D_EXOTAmount*60/100))/10  ,
	TiffinAmount=(TiffinAmount-(TiffinAmount*60/100))/10 ,
	HolidayAmount=(HolidayAmount-(HolidayAmount*60/100))/10,
	NightAmount=(NightAmount-(NightAmount*60/100))/10
	into ##tblTSWLCentral1{3}
	from ##tblTSWLCentral{3} a

	---Desig type Wise Manpower
	Select pv.* 
	into ##tbl7{3}
	From
	( 
	Select * From (
	Select CompanyId,UnitId,DepartmentId,WorkDay,SectionId, DesigGroup,CountEmp,Salary,D_ComOTAmount,D_EXOTAmount,TiffinAmount,HolidayAmount,NightAmount
	From ##tbl6{3}
	) sal
	PIVOT (SUM(CountEmp)for DesigGroup in([Central]) )As p 
	)pv


	select CompanyId,WorkDay,Salary=Sum(ISNULL(Salary,0)),
	D_ComOTAmount=Sum(ISNULL(D_ComOTAmount,0)),D_EXOTAmount=Sum(ISNULL(D_EXOTAmount,0)),
	TiffinAmount=Sum(ISNULL(TiffinAmount,0)),HolidayAmount=Sum(ISNULL(HolidayAmount,0)),NightAmount=Sum(ISNULL(NightAmount,0)), 	
	Central=Sum(ISNULL(Central,0))
	into ##tbl8{3}
	from ##tbl7{3}
	Group by  CompanyId,WorkDay

	 select a.CompanyId,CompanyName=g.ShortName,a.UnitId,UnitName=f.UnitShortName,a.SectionId,SectionName=REPLACE(a.SectionName,' ',''),WorkDay=FORMAT(a.WorkDay,'dd-MMM-yyyy')
   ,Salary=cast((((ISNULL(e.Salary,0)+h.Salary*fu.SharePer*cast(d.UnitCount as decimal))/cast(d.UnitCount as decimal))/cast(c.LineCount as decimal))as decimal(18,10))
	,D_ComOTAmount=cast((((ISNULL(e.D_ComOTAmount,0)+h.D_ComOTAmount*fu.SharePer*cast(d.UnitCount as decimal))/cast(d.UnitCount as decimal))/cast(c.LineCount as decimal))as decimal(18,10))
	,D_EXOTAmount=cast((((ISNULL(e.D_EXOTAmount,0)+h.D_EXOTAmount*fu.SharePer*cast(d.UnitCount as decimal))/cast(d.UnitCount as decimal))/cast(c.LineCount as decimal))as decimal(18,10))
	,TiffinAmount=cast((((ISNULL(e.TiffinAmount,0)+h.TiffinAmount*fu.SharePer*cast(d.UnitCount as decimal))/cast(d.UnitCount as decimal))/cast(c.LineCount as decimal))as decimal(18,10))
	,HolidayAmount=cast((((ISNULL(e.HolidayAmount,0)+h.HolidayAmount*fu.SharePer*cast(d.UnitCount as decimal))/cast(d.UnitCount as decimal))/cast(c.LineCount as decimal))as decimal(18,10))
	,NightAmount=cast((((ISNULL(e.NightAmount,0)+h.NightAmount*fu.SharePer*cast(d.UnitCount as decimal))/cast(d.UnitCount as decimal))/cast(c.LineCount as decimal))as decimal(18,10))
	,Central=cast((((ISNULL(e.Central,0)+h.CountEmp*fu.SharePer*cast(d.UnitCount as decimal))/cast(d.UnitCount as decimal))/cast(c.LineCount as decimal))as decimal(18,10))
    into ##tblOthersRawData1{3}
	from ##tblCompWiseLine{3} a
	INNER JOIN ##tblUnitWiseLineCount{3} c on c.CompanyId=a.CompanyId and c.UnitId=a.UnitId  and c.WorkDay=a.WorkDay
	INNER JOIN ##tblCompWiseUnitCount{3} d on d.CompanyId=a.CompanyId and d.WorkDay=a.WorkDay
	LEFT JOIN ##tbl8{3} e on e.CompanyId=a.CompanyId and e.WorkDay=a.WorkDay
    LEFT JOIN ProductionManagementLive.dbo.Unit f ON f.UnitId=a.UnitId
	LEFT JOIN ProductionManagementLive.dbo.Company g ON g.CompanyId=a.CompanyId
    LEFT JOIN Factory_Unit fu on fu.UnitId=f.UnitId
    left join ##tblTSWLCentral1{3} h on h.WorkDay=a.WorkDay
      {2}

       Select * 
	   into ##tblOthersRawData{3}
	   from  ##tblOthersRawData1{3} a
	   {2} {4}

    declare @DayCount int
	select @DayCount=Count(distinct WorkDay) from ##tblOthersRawData{3}

    SELECT CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,WorkDay,
	Salary,ComOT=D_ComOTAmount,EXOT=D_EXOTAmount,TA=TiffinAmount,HA=HolidayAmount,NA=NightAmount,
    Central, SL=0
    INTO ##tblCentralFinal{3}
	FROM ##tblOthersRawData{3}

	UNION ALL

	Select CompanyId,CompanyName,UnitId,UnitName,SectionId=0,SectionName='UnitWise',WorkDay,
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Central=SUM(Central), SL=1
	from ##tblOthersRawData{3}
	GROUP BY CompanyId,CompanyName,UnitId,UnitName,WorkDay

	UNION ALL

	Select CompanyId,CompanyName,UnitId=0,UnitName='',SectionId=0,SectionName='CompanyWise',WorkDay,
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Central=SUM(Central), SL=2
	from ##tblOthersRawData{3}
	GROUP BY CompanyId,CompanyName,WorkDay

	UNION ALL

	Select CompanyId=0,CompanyName='',UnitId=0,UnitName='',SectionId=0,SectionName='GrandTotal',WorkDay,
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Central=SUM(Central), SL=3
	from ##tblOthersRawData{3}
	GROUP BY WorkDay

	UNION ALL

	Select CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,WorkDay='',
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Central=SUM(Central)/@DayCount, SL=4
	from ##tblOthersRawData{3}
	GROUP BY CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName

	UNION ALL

	Select CompanyId,CompanyName,UnitId,UnitName,SectionId=0,SectionName='',WorkDay='',
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Central=SUM(Central)/@DayCount, SL=5
	from ##tblOthersRawData{3}
	GROUP BY CompanyId,CompanyName,UnitId,UnitName

	UNION ALL

	Select CompanyId,CompanyName,UnitId=0,UnitName='',SectionId=0,SectionName='',WorkDay='',
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Central=SUM(Central)/@DayCount, SL=6
	from ##tblOthersRawData{3}
	GROUP BY CompanyId,CompanyName

	UNION ALL

	Select CompanyId=0,CompanyName='',UnitId=0,UnitName='',SectionId=0,SectionName='',WorkDay='',
	Salary=SUM(Salary),D_ComOTAmount=SUM(D_ComOTAmount),D_EXOTAmount=SUM(D_EXOTAmount),
	TiffinAmount=SUM(TiffinAmount),HolidayAmount=SUM(HolidayAmount),NightAmount=SUM(NightAmount),Central=SUM(Central)/@DayCount, SL=7
	from ##tblOthersRawData{3}

	SELECT CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,WorkDay,
	Salary=(Salary+ComOT+EXOT+TA+HA+NA),
    Central,SL
	FROM ##tblCentralFinal{3}
	ORDER BY SL
	
	drop table ##tbl6{3}
	drop table ##tbl7{3}
	drop table ##tbl8{3}
	drop table ##tblCompWiseLine{3}
	drop table ##tblUnitWiseLineCount{3}
	drop table ##tblCompWiseUnitCount{3}
    drop TABLE ##tblOthersRawData1{3}
    drop TABLE ##tblOthersRawData{3}
    drop TABLE ##tblCentralFinal{3}
    drop TABLE ##tblTSWLCentral{3}
    drop TABLE ##tblTSWLCentral1{3}
    ", condition2, conditionCentral, compCondition, guidId, unitCondition, dateCondition);

            return _common.GetDataTableWithContStr(query, ConnectionString);
        }
        //================================================================New Query=======================================================
        public DataTable GetFactoryWashingData(string condition, string compCondition, string fromDate)
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");

            string query = string.Format(@"
        --For Getting All Line By Unit
	    select distinct a.CompanyId,a.UnitId,a.SectionId
	    into ##tblCompWiseLine{0} 
	    from DeptWiseDailyData a
		inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
        {1}  AND isnull(b.ParentUnitId,0)>0 AND b.IsActive=1 
	    Group by a.CompanyId,a.UnitId,a.SectionId,a.DesigGroup,a.SortOrder

		    --Comp Line Count
	    select a.CompanyId,a.UnitId,LineCount=COUNT(distinct a.SectionId) 
	    into ##tblUnitWiseLineCount{0}
	    from ##tblCompWiseLine{0} a
	   -- WHERE a.CompanyId=14
        {2}
	    GROUP BY a.CompanyId,a.UnitId


	     --MIS Cost
	     select 
		TotalRowMaterials=isnull(a.TotalRowMaterials,0),
		PowerUtilities=isnull(a.PowerUtilities,0),
	    RepairMtnSpares=isnull(a.RepairMtnSpares,0),
	    CarriageTransFreights=isnull(a.CarriageTransFreights,0),
	    IndirectMaterialServices=isnull(a.IndirectMaterialServices,0),
	    ConveyEntertainStationeryOthers=isnull(a.ConveyEntertainStationeryOthers,0),
	    TotalRents=isnull(a.TotalRents,0),
		TotalZonalHODepreciation=isnull(a.TotalZonalHODepreciation,0),
	    TTLEmpBenefitsExcludingSalaryWagOvrtNightHoliday=isnull(a.TTLEmpBenefitsExcludingSalaryWagOvrtNightHoliday,0),
		TotalMis=(
			isnull(a.TotalRowMaterials,0)
            +isnull(a.PowerUtilities,0)
		    +isnull(a.RepairMtnSpares,0)
		    +isnull(a.CarriageTransFreights,0)
		    +isnull(a.IndirectMaterialServices,0) 
		    +isnull(a.ConveyEntertainStationeryOthers,0)
		    +isnull(a.TotalRents,0)
			+isnull(a.TotalZonalHODepreciation,0)
			+isnull(a.TTLEmpBenefitsExcludingSalaryWagOvrtNightHoliday,0)
            ),
	    c.CompanyId,a.UnitId,a.[Year],a.[Month]
	    Into ##tblMisCost{0}
	    from ProductionManagementLive.dbo.MISCostWash a
	    left join Factory_Unit U on a.UnitId=u.UnitId
	    inner join (
	    Select MaxYear=Max([Year]),MaxMonth=Max([Month]),CompanyId,a.UnitId from ProductionManagementLive.dbo.MISCostWash mis
	    left join Factory_Unit a on mis.UnitId=a.UnitId
        {2} and [Year]=( Select MaxYear=Max([Year]) from ProductionManagementLive.dbo.MISCostWash)
	    group by a.CompanyId,a.UnitId
	    ) c on c.CompanyId=u.CompanyId and c.UnitId=a.UnitId and a.Year=c.MaxYear and a.Month=c.MaxMonth

	     select a.CompanyId,a.UnitId,LineCount,
		TotalRowMaterials=cast((a.TotalRowMaterials/cast(b.LineCount as decimal))as decimal(18,10)),
	    PowerUtilities=cast((a.PowerUtilities/cast(b.LineCount as decimal))as decimal(18,10)),
	    RepairMtnSpares=cast((a.RepairMtnSpares/cast(b.LineCount as decimal))as decimal(18,10)),
	    CarriageTransFreights=cast((a.CarriageTransFreights/cast(b.LineCount as decimal))as decimal(18,10)),
	    IndirectMaterialServices=cast((a.IndirectMaterialServices/cast(b.LineCount as decimal))as decimal(18,10)),
	    ConveyEntertainStationeryOthers=cast((a.ConveyEntertainStationeryOthers/cast(b.LineCount as decimal))as decimal(18,10)),
	    TotalRents=cast((a.TotalRents/cast(b.LineCount as decimal))as decimal(18,10)),
	    TotalZonalHODepreciation=cast((a.TotalZonalHODepreciation/cast(b.LineCount as decimal))as decimal(18,10)),
        TTL=cast((a.TTLEmpBenefitsExcludingSalaryWagOvrtNightHoliday/cast(b.LineCount as decimal))as decimal(18,10)),
        TotalMis=cast((a.TotalMis/cast(b.LineCount as decimal))as decimal(18,10))
	    INTO ##tblMisCost1{0}
	    from ##tblMisCost{0} a
	    INNER JOIN ##tblUnitWiseLineCount{0} b on b.CompanyId=a.CompanyId and b.UnitId=a.UnitId
	


        --OT Amount
	    select CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,DesigGroup,WorkDay,SortOrder,
	    CountEmp=Sum(CountEmp),Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),
	    TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount) 
	    into ##tbl1{0}
	    from DeptWiseDailyData a
	    --where WorkDay='21-Dec-2020' and CompanyId=14 and SectionName Like 'LINE%'
        {1}
	    Group by CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,DesigGroup,WorkDay,SortOrder
	    Order by SortOrder

	    ---Desig type Wise Manpower
	    Select pv.* 
	    into ##tbl2{0}
	    From
	    ( 
	    Select * From (
	    Select CompanyId,CompanyName,UnitId,UnitName,WorkDay,SectionId,SectionName, DesigGroup='Washing',CountEmp,Salary,D_ComOTAmount,D_EXOTAmount,TiffinAmount,HolidayAmount,NightAmount From ##tbl1{0}
	    ) sal
	    PIVOT (SUM(CountEmp)for DesigGroup in([Washing]))As p 
	    )pv


      select CompanyId,CompanyName,UnitId,UnitName,WorkDay,SectionId,SectionName,Salary=Sum(ISNULL(Salary,0)),D_ComOTAmount=Sum(ISNULL(D_ComOTAmount,0)),D_EXOTAmount=Sum(ISNULL(D_EXOTAmount,0)),TiffinAmount=Sum(ISNULL(TiffinAmount,0)),HolidayAmount=Sum(ISNULL(HolidayAmount,0)),NightAmount=Sum(ISNULL(NightAmount,0)),
      Washing=Sum(ISNULL(Washing,0))
      into ##tblWashing{0}
      from ##tbl2{0}
      Group by  CompanyId,CompanyName,UnitId,UnitName,WorkDay,SectionId,SectionName

    

	  
	   Select a.CompanyId,CompanyName=e.CompanyName,a.UnitId,UnitName=d.UnitName,WorkDay=FORMAT(a.WorkDay,'dd-MMM-yyyy'),a.SectionId,SectionName=REPLACE(SectionName,' ',''),Salary,
	    D_ComOTAmount,D_EXOTAmount,TiffinAmount,HolidayAmount,NightAmount,
	    Washing,
	    TotalRowMaterials=cast(b.TotalRowMaterials/ISNULL(md.DayCount,25)  as decimal(18,6)),
		PowerUtilities=cast(b.PowerUtilities/ISNULL(md.DayCount,25) as decimal(18,6)),
		RepairMtnSpares=cast(b.RepairMtnSpares/ISNULL(md.DayCount,25) as decimal(18,6)),
		CarriageTransFreights=cast(b.CarriageTransFreights/ISNULL(md.DayCount,25) as decimal(18,6)),
		IndirectMaterialServices=cast(b.IndirectMaterialServices/ISNULL(md.DayCount,25) as decimal(18,6)),	
		ConveyEntertainStationeryOthers=cast(b.ConveyEntertainStationeryOthers/ISNULL(md.DayCount,25) as decimal(18,6)),
		TotalRents=cast(b.TotalRents/ISNULL(md.DayCount,25) as decimal(18,6)),
		TotalZonalHODepreciation=cast(b.TotalZonalHODepreciation/ISNULL(md.DayCount,25) as decimal(18,6)),	
		TTL=cast(b.TTL/ISNULL(md.DayCount,25) as decimal(18,6)),
		TotalMis=cast(b.TotalMis/ISNULL(md.DayCount,25) as decimal(18,6))
		into ##tblWashingRawData{0}
	    from ##tblWashing{0} a
	    left join ##tblMisCost1{0} b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
        LEFT JOIN Factory_Unit d ON d.UnitId=a.UnitId
		LEFT JOIN Factory_Company e ON e.CompanyId=a.CompanyId
        LEFT JOIN ProductionManagementLive.dbo.MISCostDayCount_Wash md ON md.[Month] = MONTH(a.WorkDay) AND md.[YEAR] = YEAR(a.WorkDay)

        declare @DayCount int
		select @DayCount=Count(distinct WorkDay) from ##tblWashingRawData{0}

        --Unit Wise MIS Data Push
		Select  
		CompanyId,CompanyName,UnitId,UnitName,SectionId=0,SectionName='UnitWise',WorkDay,Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    Washing=sum(Washing),
	      TotalRowMaterials=sum(ISNULL(TotalRowMaterials,0)),PowerUtilities=sum(ISNULL(PowerUtilities,0)),RepairMtnSpares=sum(ISNULL(RepairMtnSpares,0)),CarriageTransFreights=sum(ISNULL(CarriageTransFreights,0)),IndirectMaterialServices=sum(ISNULL(IndirectMaterialServices,0)),	
	    ConveyEntertainStationeryOthers=sum(ISNULL(ConveyEntertainStationeryOthers,0)),TotalRents=sum(ISNULL(TotalRents,0)),TotalZonalHODepreciation=sum(ISNULL(TotalZonalHODepreciation,0)),	
	    TTL=sum(ISNULL(TTL,0)),TotalMis=sum(ISNULL(TotalMis,0))
	    into ##tblSL1UnitWiseData{0}
		from ##tblWashingRawData{0}
		Group By CompanyId,CompanyName,UnitId,UnitName,WorkDay

		select 
		a.CompanyId,CompanyName,a.UnitId,UnitName,SectionId,SectionName,WorkDay,Salary, 
		D_ComOTAmount,D_EXOTAmount,
		TiffinAmount,HolidayAmount,NightAmount,
	    Washing,
		 TotalRowMaterials=cast(b.TotalRowMaterials/ISNULL(md.DayCount,25)  as decimal(18,6)),
		PowerUtilities=cast(b.PowerUtilities/ISNULL(md.DayCount,25) as decimal(18,6)),
		RepairMtnSpares=cast(b.RepairMtnSpares/ISNULL(md.DayCount,25) as decimal(18,6)),
		CarriageTransFreights=cast(b.CarriageTransFreights/ISNULL(md.DayCount,25) as decimal(18,6)),
		IndirectMaterialServices=cast(b.IndirectMaterialServices/ISNULL(md.DayCount,25) as decimal(18,6)),	
		ConveyEntertainStationeryOthers=cast(b.ConveyEntertainStationeryOthers/ISNULL(md.DayCount,25) as decimal(18,6)),
		TotalRents=cast(b.TotalRents/ISNULL(md.DayCount,25) as decimal(18,6)),
		TotalZonalHODepreciation=cast(b.TotalZonalHODepreciation/ISNULL(md.DayCount,25) as decimal(18,6)),	
		TTL=cast(b.TTLEmpBenefitsExcludingSalaryWagOvrtNightHoliday/ISNULL(md.DayCount,25) as decimal(18,6)),
		TotalMis=cast(b.TotalMis/ISNULL(md.DayCount,25) as decimal(18,6))
		into ##tblWashingRawDataNew{0}
		from ##tblSL1UnitWiseData{0} a
		left join ##tblMisCost{0} b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId 
		LEFT JOIN ProductionManagementLive.dbo.MISCostDayCount_Wash md ON md.[Month] = MONTH(a.WorkDay) AND md.[YEAR] = YEAR(a.WorkDay)

		--End Unit Wise MIS Data Push

		select CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,WorkDay,Salary,
	    ComOT=D_ComOTAmount,EXOT=D_EXOTAmount,TA=TiffinAmount,HA=HolidayAmount,NA=NightAmount,
	    Washing,
	    TRM=ISNULL(TotalRowMaterials,0),PU=ISNULL(PowerUtilities,0),RMS=ISNULL(RepairMtnSpares,0),CTF=ISNULL(CarriageTransFreights,0),IMS=ISNULL(IndirectMaterialServices,0),	
	    CESO=ISNULL(ConveyEntertainStationeryOthers,0),TR=ISNULL(TotalRents,0),TZHD=ISNULL(TotalZonalHODepreciation,0),TTL=ISNULL(TTL,0),TotalMis=ISNULL(TotalMis,0),
		SL=0
		from ##tblWashingRawData{0}

		UNION ALL

	    Select  
		CompanyId,CompanyName,UnitId,UnitName,SectionId=0,SectionName='UnitWise',WorkDay,Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    Washing=sum(Washing),
	      TotalRowMaterials=sum(ISNULL(TotalRowMaterials,0)),PowerUtilities=sum(ISNULL(PowerUtilities,0)),RepairMtnSpares=sum(ISNULL(RepairMtnSpares,0)),CarriageTransFreights=sum(ISNULL(CarriageTransFreights,0)),IndirectMaterialServices=sum(ISNULL(IndirectMaterialServices,0)),	
	    ConveyEntertainStationeryOthers=sum(ISNULL(ConveyEntertainStationeryOthers,0)),TotalRents=sum(ISNULL(TotalRents,0)),TotalZonalHODepreciation=sum(ISNULL(TotalZonalHODepreciation,0)),	
	    TTL=sum(ISNULL(TTL,0)),TotalMis=sum(ISNULL(TotalMis,0)),
	    SL=1
		from ##tblWashingRawDataNew{0}
		Group By CompanyId,CompanyName,UnitId,UnitName,WorkDay

		UNION ALL

	    Select  
		CompanyId,CompanyName,UnitId=0,UnitName='',SectionId=0,SectionName='CompanyWise',WorkDay,Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    Washing=sum(Washing),
	     TotalRowMaterials=sum(ISNULL(TotalRowMaterials,0)),PowerUtilities=sum(ISNULL(PowerUtilities,0)),RepairMtnSpares=sum(ISNULL(RepairMtnSpares,0)),CarriageTransFreights=sum(ISNULL(CarriageTransFreights,0)),IndirectMaterialServices=sum(ISNULL(IndirectMaterialServices,0)),	
	    ConveyEntertainStationeryOthers=sum(ISNULL(ConveyEntertainStationeryOthers,0)),TotalRents=sum(ISNULL(TotalRents,0)),TotalZonalHODepreciation=sum(ISNULL(TotalZonalHODepreciation,0)),	
	    TTL=sum(ISNULL(TTL,0)),TotalMis=sum(ISNULL(TotalMis,0)),
		SL=2
		from ##tblWashingRawDataNew{0}
		Group By CompanyId,CompanyName,WorkDay

		UNION ALL

		Select  
		CompanyId='',CompanyName='',UnitId=0,UnitName='',SectionId=0,SectionName='GrandTotal',WorkDay,Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    Washing=sum(Washing),
	      TotalRowMaterials=sum(ISNULL(TotalRowMaterials,0)),PowerUtilities=sum(ISNULL(PowerUtilities,0)),RepairMtnSpares=sum(ISNULL(RepairMtnSpares,0)),CarriageTransFreights=sum(ISNULL(CarriageTransFreights,0)),IndirectMaterialServices=sum(ISNULL(IndirectMaterialServices,0)),	
	    ConveyEntertainStationeryOthers=sum(ISNULL(ConveyEntertainStationeryOthers,0)),TotalRents=sum(ISNULL(TotalRents,0)),TotalZonalHODepreciation=sum(ISNULL(TotalZonalHODepreciation,0)),	
	    TTL=sum(ISNULL(TTL,0)),TotalMis=sum(ISNULL(TotalMis,0)),
		SL=3
		from ##tblWashingRawDataNew{0}
		Group By WorkDay

        UNION ALL

	     Select  
		CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName,WorkDay='',Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    Washing=sum(Washing)/@DayCount,
	      TotalRowMaterials=sum(ISNULL(TotalRowMaterials,0)),PowerUtilities=sum(ISNULL(PowerUtilities,0)),RepairMtnSpares=sum(ISNULL(RepairMtnSpares,0)),CarriageTransFreights=sum(ISNULL(CarriageTransFreights,0)),IndirectMaterialServices=sum(ISNULL(IndirectMaterialServices,0)),	
	    ConveyEntertainStationeryOthers=sum(ISNULL(ConveyEntertainStationeryOthers,0)),TotalRents=sum(ISNULL(TotalRents,0)),TotalZonalHODepreciation=sum(ISNULL(TotalZonalHODepreciation,0)),	
	    TTL=sum(ISNULL(TTL,0)),TotalMis=sum(ISNULL(TotalMis,0)),
		SL=4
		from ##tblWashingRawDataNew{0}
		Group By CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName

		UNION ALL
		
		Select  
		CompanyId,CompanyName,UnitId,UnitName,SectionId=0,SectionName='',WorkDay='',Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    Washing=sum(Washing)/@DayCount,
	      TotalRowMaterials=sum(ISNULL(TotalRowMaterials,0)),PowerUtilities=sum(ISNULL(PowerUtilities,0)),RepairMtnSpares=sum(ISNULL(RepairMtnSpares,0)),CarriageTransFreights=sum(ISNULL(CarriageTransFreights,0)),IndirectMaterialServices=sum(ISNULL(IndirectMaterialServices,0)),	
	    ConveyEntertainStationeryOthers=sum(ISNULL(ConveyEntertainStationeryOthers,0)),TotalRents=sum(ISNULL(TotalRents,0)),TotalZonalHODepreciation=sum(ISNULL(TotalZonalHODepreciation,0)),	
	    TTL=sum(ISNULL(TTL,0)),TotalMis=sum(ISNULL(TotalMis,0)),
		SL=5
		from ##tblWashingRawDataNew{0}
		Group By CompanyId,CompanyName,UnitId,UnitName

		UNION ALL
		
	    Select  
		CompanyId,CompanyName,UnitId=0,UnitName='',SectionId=0,SectionName='',WorkDay='',Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    Washing=sum(Washing)/@DayCount,
	      TotalRowMaterials=sum(ISNULL(TotalRowMaterials,0)),PowerUtilities=sum(ISNULL(PowerUtilities,0)),RepairMtnSpares=sum(ISNULL(RepairMtnSpares,0)),CarriageTransFreights=sum(ISNULL(CarriageTransFreights,0)),IndirectMaterialServices=sum(ISNULL(IndirectMaterialServices,0)),	
	    ConveyEntertainStationeryOthers=sum(ISNULL(ConveyEntertainStationeryOthers,0)),TotalRents=sum(ISNULL(TotalRents,0)),TotalZonalHODepreciation=sum(ISNULL(TotalZonalHODepreciation,0)),	
	    TTL=sum(ISNULL(TTL,0)),TotalMis=sum(ISNULL(TotalMis,0)),
		SL=6
		from ##tblWashingRawDataNew{0}
		Group By CompanyId,CompanyName

        UNION ALL
		
		Select  
		CompanyId=0,CompanyName='',UnitId=0,UnitName='',SectionId=0,SectionName='',WorkDay='',Salary=Sum(Salary),
		D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=sum(D_EXOTAmount),
		TiffinAmount=sum(TiffinAmount),HolidayAmount=sum(HolidayAmount),NightAmount=sum(NightAmount),
	    Washing=sum(Washing)/@DayCount,
	     TotalRowMaterials=sum(ISNULL(TotalRowMaterials,0)),PowerUtilities=sum(ISNULL(PowerUtilities,0)),RepairMtnSpares=sum(ISNULL(RepairMtnSpares,0)),CarriageTransFreights=sum(ISNULL(CarriageTransFreights,0)),IndirectMaterialServices=sum(ISNULL(IndirectMaterialServices,0)),	
	    ConveyEntertainStationeryOthers=sum(ISNULL(ConveyEntertainStationeryOthers,0)),TotalRents=sum(ISNULL(TotalRents,0)),TotalZonalHODepreciation=sum(ISNULL(TotalZonalHODepreciation,0)),	
	    TTL=sum(ISNULL(TTL,0)),TotalMis=sum(ISNULL(TotalMis,0)),
		SL=7
		from ##tblWashingRawDataNew{0}
		
		order by SL

	    drop table ##tbl1{0}
	    drop table ##tbl2{0}
	    drop table ##tblWashing{0}
	    drop table ##tblCompWiseLine{0}
	    drop table ##tblUnitWiseLineCount{0}
	    drop table ##tblMisCost{0}
	    drop table ##tblMisCost1{0}
		drop table ##tblWashingRawData{0}
        drop table ##tblWashingRawDataNew{0}
        drop table ####tblSL1UnitWiseData{0}", guidId, condition, compCondition, fromDate);

            return _common.GetDataTableWithContStr(query, ConnectionString);
        }

        public DataTable GetFactoryManagementWashingData(string conditionMgmt, string condition2, string compcondition)
        {
            string guidId = Guid.NewGuid().ToString().Replace("-", "");

            string query = string.Format(@"
	       select a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.SectionId,a.SectionName,a.DesigGroup,a.WorkDay,a.SortOrder,
	        CountEmp=Sum(CountEmp),Salary=Sum(Salary),DayTotalCost=Sum(DayTotalCost),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),
	        TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount) 
	        into ##tbl3{1}
	        from DeptWiseDailyData  a
			inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
            {0}
	        Group by a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.SectionId,a.SectionName,a.DesigGroup,a.WorkDay,a.SortOrder
	        Order by a.SortOrder

            --Desig type Wise Manpower
	        Select pv.* 
	        into ##tbl4{1}
	        From
	        ( 
	        Select * From (
	        Select CompanyId,UnitId,UnitName,WorkDay,SectionId, DesigGroup,CountEmp,
            Salary,D_ComOTAmount,D_EXOTAmount,TiffinAmount,HolidayAmount,NightAmount 
            From ##tbl3{1}
	        ) sal
	        PIVOT (SUM(CountEmp)for DesigGroup in([ExecutiveDirector],[GeneralManager],[Manager],[ProductionManager],[IE]) )As p 
	        )pv

	        select CompanyId,UnitId,WorkDay,Salary=Sum(ISNULL(Salary,0)),
            D_ComOTAmount=Sum(ISNULL(D_ComOTAmount,0)),D_EXOTAmount=Sum(ISNULL(D_EXOTAmount,0)),TiffinAmount=Sum(ISNULL(TiffinAmount,0)),HolidayAmount=Sum(ISNULL(HolidayAmount,0)),NightAmount=Sum(ISNULL(NightAmount,0)),
	        ED=Sum(ISNULL([ExecutiveDirector],0)),
	        GM=Sum(ISNULL([GeneralManager],0)),
	        Manager=Sum(ISNULL(Manager,0)),
            PM=Sum(ISNULL([ProductionManager],0)),
            IE=Sum(ISNULL(IE,0))
	        into ##tbl5{1}
	        from ##tbl4{1}
	        Group by  CompanyId,UnitId,WorkDay

	         --For Getting All Line By Unit
	        select distinct a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.SectionId,a.SectionName
	        into ##tblCompWiseLine{1}
	        from DeptWiseDailyData a
			inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
            {2}
	        Group by a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.SectionId,a.SectionName,a.DesigGroup,a.SortOrder

             --For Getting All Line By Workday
	        select distinct a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.SectionId,a.SectionName,a.WorkDay
	        into ##tblWorkDayWiseLine{1}
	        from DeptWiseDailyData a
			inner join Factory_Unit b on a.CompanyId=b.CompanyId and a.UnitId=b.UnitId
            {2}
	       Group by a.CompanyId,a.CompanyName,a.UnitId,a.UnitName,a.SectionId,a.SectionName,a.DesigGroup,a.WorkDay,a.SortOrder

		        --Comp Line Count
	        select a.CompanyId,a.UnitId,WorkDay,LineCount=COUNT(distinct a.SectionId) 
	        into ##tblUnitWiseLineCount{1}
	        from ##tblWorkDayWiseLine{1} a
            {3}
	        GROUP BY a.CompanyId,a.UnitId,UnitName,WorkDay

	        --Comp Unit Count
	        --select CompanyId,UnitCount=count(distinct UnitId) 
	        --into ##tblCompWiseUnitCount{1}
	        --from ##tblUnitWiseLineCount{1}
	        --GROUP BY CompanyId

	        select a.CompanyId,g.CompanyName,a.UnitId,f.UnitName, a.SectionId,SectionName=REPLACE(a.SectionName,' ',''),WorkDay=FORMAT(e.WorkDay,'dd-MMM-yyyy')
	       ,Salary=cast((e.Salary/cast(c.LineCount as decimal))as decimal(18,10))
            ,D_ComOTAmount=cast((e.D_ComOTAmount/cast(c.LineCount as decimal))as decimal(18,10))
			,D_EXOTAmount=cast((e.D_EXOTAmount/cast(c.LineCount as decimal))as decimal(18,10))
			,TiffinAmount=cast((e.TiffinAmount/cast(c.LineCount as decimal))as decimal(18,10))
			,HolidayAmount=cast((e.HolidayAmount/cast(c.LineCount as decimal))as decimal(18,10))
			,NightAmount=cast((e.NightAmount/cast(c.LineCount as decimal))as decimal(18,10))
	        ,ED=cast((e.ED/cast(c.LineCount as decimal))as decimal(18,10))
	        ,GM=cast((e.GM/cast(c.LineCount as decimal))as decimal(18,10))
	        ,Manager=cast((e.Manager/cast(c.LineCount as decimal))as decimal(18,10))
            ,PM=cast((e.PM/cast(c.LineCount as decimal))as decimal(18,10))
            ,IE=cast((e.IE/cast(c.LineCount as decimal))as decimal(18,10))
            into ##tblManagementRawData{1}
	        from ##tblWorkDayWiseLine{1} a
	        INNER JOIN ##tblUnitWiseLineCount{1} c on c.CompanyId=a.CompanyId and c.UnitId=a.UnitId and c.WorkDay=a.WorkDay
	        INNER JOIN ##tbl5{1} e on e.CompanyId=a.CompanyId and e.UnitId=a.UnitId and e.WorkDay=a.WorkDay
            LEFT JOIN Factory_Unit f ON f.UnitId=a.UnitId
			LEFT JOIN Factory_Company g ON g.CompanyId=a.CompanyId
            {3}

            declare @DayCount int
		    select @DayCount=Count(distinct WorkDay) from ##tblManagementRawData{1}

             Select CompanyId,CompanyName,UnitId,UnitName, SectionId,SectionName,WorkDay,
             Salary,ComOT=D_ComOTAmount,EXOT=D_EXOTAmount,TA=TiffinAmount,HA=HolidayAmount,NA=NightAmount,
             ED,GM,MGR=Manager,PM,IE, SL=0
			 from ##tblManagementRawData{1}

			 UNION ALL

			 Select CompanyId,CompanyName,UnitId,UnitName, SectionId=0,SectionName='UnitWise',WorkDay,
            Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
            ED=Sum(ED),GM=Sum(GM),Manager=Sum(Manager),PM=Sum(PM),IE=Sum(IE),SL=1
			 from ##tblManagementRawData{1}
			 Group By CompanyId,CompanyName,UnitId,UnitName,WorkDay

			 UNION ALL

			 Select CompanyId,CompanyName,UnitId=0,UnitName='', SectionId=0,SectionName='CompanyWise',WorkDay,
            Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
            ED=Sum(ED),GM=Sum(GM),Manager=Sum(Manager),PM=Sum(PM),IE=Sum(IE),SL=2
			 from ##tblManagementRawData{1}
			 Group By CompanyId,CompanyName,WorkDay

			 UNION ALL

			 Select CompanyId=0,CompanyName='',UnitId=0,UnitName='', SectionId=0,SectionName='GrandTotal',WorkDay,
             Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
             ED=Sum(ED),GM=Sum(GM),Manager=Sum(Manager),PM=Sum(PM),IE=Sum(IE),SL=3
			 from ##tblManagementRawData{1}
			 Group By WorkDay
            UNION ALL

			 Select CompanyId,CompanyName,UnitId,UnitName, SectionId,SectionName,WorkDay='',
             Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
             ED=Sum(ED)/@DayCount,GM=Sum(GM)/@DayCount,Manager=SUM(Manager)/@DayCount,PM=Sum(PM)/@DayCount,IE=Sum(IE)/@DayCount,SL=4
			 from ##tblManagementRawData{1}
			 Group By CompanyId,CompanyName,UnitId,UnitName,SectionId,SectionName

			 UNION ALL

			 Select CompanyId,CompanyName,UnitId,UnitName, SectionId=0,SectionName='',WorkDay='',
             Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
             ED=Sum(ED)/@DayCount,GM=Sum(GM)/@DayCount,Manager=SUM(Manager)/@DayCount,PM=Sum(PM)/@DayCount,IE=Sum(IE)/@DayCount,SL=5
			 from ##tblManagementRawData{1}
			 Group By CompanyId,CompanyName,UnitId,UnitName

			 UNION ALL

			 Select CompanyId,CompanyName,UnitId=0,UnitName='', SectionId=0,SectionName='',WorkDay='',
             Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
             ED=Sum(ED)/@DayCount,GM=Sum(GM)/@DayCount,Manager=SUM(Manager)/@DayCount,PM=Sum(PM)/@DayCount,IE=Sum(IE)/@DayCount,SL=6
			 from ##tblManagementRawData{1}
			 Group By CompanyId,CompanyName

			  UNION ALL

			 Select CompanyId=0,CompanyName='',UnitId=0,UnitName='', SectionId=0,SectionName='',WorkDay='',
             Salary=Sum(Salary),D_ComOTAmount=Sum(D_ComOTAmount),D_EXOTAmount=Sum(D_EXOTAmount),TiffinAmount=Sum(TiffinAmount),HolidayAmount=Sum(HolidayAmount),NightAmount=Sum(NightAmount),
             ED=Sum(ED)/@DayCount,GM=Sum(GM)/@DayCount,Manager=SUM(Manager)/@DayCount,PM=Sum(PM)/@DayCount,IE=Sum(IE)/@DayCount,SL=7
			 from ##tblManagementRawData{1}

             ORDER BY SL

	        drop table ##tbl3{1}
	        drop table ##tbl4{1}
	        drop table ##tbl5{1}
	        drop table ##tblCompWiseLine{1}
	        drop table ##tblUnitWiseLineCount{1}
            drop table ##tblManagementRawData{1}
			drop table ##tblWorkdayWiseLine{1}", conditionMgmt, guidId, condition2, compcondition);

            return _common.GetDataTableWithContStr(query, ConnectionString);
        }
    }
}
