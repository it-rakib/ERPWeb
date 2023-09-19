using System;

namespace ERP_WEB.LegalReports.Entity
{
    public class ExpenseReports
    {
        public int FileMasterId { get; set; }
        public string RegNo { get; set; }
        public string CaseNo { get; set; }
        public string CourtName { get; set; }
        public int FileTypeId { get; set; }
        public string FileTypeName { get; set; }
        public bool IsPublish { get; set; }
        public int ExpenseId { get; set; }
        public string ExpenseDate { get; set; }
        public string ExpenseName { get; set; }
        public decimal Amount { get; set; }
  
    }
}