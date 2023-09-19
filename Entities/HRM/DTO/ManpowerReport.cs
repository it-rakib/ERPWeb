using System;

namespace Entities.HRM.DTO
{
    public class ManpowerReport
    {
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public int UnitId { get; set; }
        public string UnitName { get; set; }
        public int SectionId { get; set; }
        public string SectionName { get; set; }
        public string DesignationId => this.DesigGroup;
        public string DesignationName => this.DesigGroup;
        public int CountEmp { get; set; }
        public int SortOrder { get; set; }
        public string DesigGroup { get; set; }
        public decimal Salary { get; set; }
        public decimal DayTotalCost { get; set; }
        public decimal Earn { get; set; }
        public decimal ProdQty { get; set; }
        public decimal D_ComOTAmount { get; set; }
        public decimal D_EXOTAmount { get; set; }
        public decimal TiffinAmount { get; set; }
        public decimal HolidayAmount { get; set; }
        public decimal NightAmount { get; set; }
        public string BuyerName { get; set; }

        public DateTime WorkDay { get; set; }
        public string WorkDaySt => this.WorkDay.ToString("dd-MMM-yyyy");
    }
}
