using Entities.HRM;
using Entities.HRM.DTO;
using System.Collections.Generic;

namespace BLL.HRM.Common
{
    public interface ICommonRepository
    {
        List<PaymentMode> GetAllPaymentMode();
        List<CurrencyType> GetAllCurrency();
        List<BankInfo> GetAllBank();
        List<Common_Company> GetAllSalaryPayCompany();
        List<BankBranchInfo> GetAllBranchByBank(int bankId);

        List<Formula> GetAllFormula();
        List<Common_AllType> GetAllIncrementType();
        List<Common_AllType> GetAllUserLevel(string empid);
        HRMMode GetHRMMode(int unitId);
        string SaveHRMMode(HRMMode objHrmMode);
        List<Common_Project> GetAllProjectList();
        List<Common_District> GetAllDistrict();
        List<Common_Unit> GetAllUnit();
        List<Common_Department> GetAllDepartment();
        List<Employees> GetAllEmployee(string companyId);
    }
}
