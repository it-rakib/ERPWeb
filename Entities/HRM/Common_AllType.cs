namespace Entities.HRM
{
    public class Common_AllType
    {
        public int TypeId { get; set; }
        public string TypeName { get; set; }

    }

    public class Common_Project
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }

    }

    public class PaymentMode
    {
        public int PaymentModeId { get; set; }
        public string PaymentModeName { get; set; }
    }
    public class CurrencyType
    {
        public int CurrencyId { get; set; }
        public string CurrencyName { get; set; }
    }
    public class BankInfo
    {
        public int BankId { get; set; }
        public string BankName { get; set; }
    }
    public class BankBranchInfo
    {
        public int BranchId { get; set; }
        public string BranchName { get; set; }
    }
    public class Formula
    {
        public int FormulaId { get; set; }
        public string FormulaName { get; set; }
        public string SalaryStructure { get; set; }
    }

    public class ActionTime
    {
        public string ActionDate { get; set; }
        public string ActionDate1 { get; set; }

        public string PaySlipDate { get; set; }
    }
}
