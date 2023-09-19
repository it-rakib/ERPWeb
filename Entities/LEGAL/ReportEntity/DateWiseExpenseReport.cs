using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.LEGAL.ReportEntity
{
    public class DateWiseExpenseReport
    {
        public int FileMasterId { get; set; }
        public string RegNo { get; set; }
        public int FileTypeId { get; set; }
        public string FileTypeName { get; set; }
        public bool IsPublish { get; set; }
        public int ExpenseId { get; set; }
        public String ExpenseDate { get; set; }
        public string ExpenseName { get; set; }
        public decimal Amount { get; set; }
        public int CourtId { get; set; }
        public string CourtName { get; set; }
        public string CaseNo { get; set; }
        public string Discription { get; set; }
    }
}
