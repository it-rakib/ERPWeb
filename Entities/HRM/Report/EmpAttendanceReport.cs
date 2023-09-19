using System;
using System.Collections.Generic;

namespace Entities.HRM.Report
{
    public class EmpAttendanceReport
    {
        public string Emp_Id { get; set; }
        public string Emp_Name { get; set; }
        public string Company_Name { get; set; }
        public string Branch_Name { get; set; }
        public string Department_Name { get; set; }
        public string Section_Name { get; set; }//
        public string SectionName { get; set; }
        public string WingName { get; set; }
        public string TeamName { get; set; }
        public string Designation_Name { get; set; }
        public string Category_Name { get; set; }
        public string Join_Date { get; set; }
        public string Card_No { get; set; }
        public int Emp_No { get; set; }//EmpID
        public DateTime Work_Date { get; set; }
        public string In_Time { get; set; }
        public string Out_Time { get; set; }
        public string ShiftName { get; set; }
        public string AttStatus { get; set; }
        public string InRemarks { get; set; }
        public string OutRemarks { get; set; }

        public string Late_Min { get; set; }
        public string Early_Min { get; set; }
        public string Org_Att_Status { get; set; }
        public string Remarks { get; set; }
        public string Manual_Bit { get; set; }
        public string Work_Time { get; set; }
        public string Ex_Work_Time { get; set; }
        public string Tiffin_Day { get; set; }
        public string Holiday { get; set; }

        public string LabelText { get; set; }

        //====================
        public string Work_DateSt => this.Work_Date.ToString("dd-MMM-yyyy");
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public List<string> Dates { get; set; } = new List<string>();

        public int TotalCount { get; set; }
        public string Emp_Nos { get; set; }

        public int PunchNo { get; set; }

        public decimal GrossSalary { get; set; }
        public string PayrollCompanyName { get; set; }
    }
}
