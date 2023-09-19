using DAL.Common;
using Entities.HRM;
using Entities.HRM.DTO;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DAL.HRM
{
    public class HrmCommonDataService
    {
        readonly CommonDataServiceHRM _commonHRM = new CommonDataServiceHRM();
        readonly CommonDataService _common = new CommonDataService();

        public List<PaymentMode> GetAllPaymentMode()
        {
            return _commonHRM.Select_Data_List<PaymentMode>("Sp_Select_Common_Info", "get_all_payment_mode");
        }

        public List<CurrencyType> GetAllCurrency()
        {
            return _commonHRM.Select_Data_List<CurrencyType>("Sp_Select_Common_Info", "get_all_currency");
        }

        public List<BankInfo> GetAllBank()
        {
            return _commonHRM.Select_Data_List<BankInfo>("Sp_Select_Common_Info", "get_all_bank");
        }

        public List<Common_Company> GetAllSalaryPayCompany()
        {
            return _commonHRM.Select_Data_List<Common_Company>("Sp_Select_Common_Info", "get_all_salary_paid_company");
        }

        public List<BankBranchInfo> GetAllBranchByBank(int bankId)
        {
            return _commonHRM.Select_Data_List<BankBranchInfo>("Sp_Select_Common_Info", "get_all_bank_branch", bankId.ToString());
        }



        public List<Formula> GetAllFormula()
        {
            return _commonHRM.Select_Data_List<Formula>("Sp_Select_Common_Info", "get_all_Formula");
        }

        public List<Common_AllType> GetAllIncrementType()
        {
            return _commonHRM.Select_Data_List<Common_AllType>("Sp_Select_Common_Info", "get_all_Increment_Type");
        }

        public List<Common_AllType> GetAllUserLevel(string empid)
        {
            return _common.Select_Data_List<Common_AllType>("sp_select_user", "get_all_user_level", empid);

        }

        public HRMMode GetHRMMode(int unitId)
        {
            return _commonHRM.Select_Data_List<HRMMode>("Sp_Select_Common_Info", "get_hrm_mode", unitId.ToString()).SingleOrDefault();
        }

        public List<Common_Project> GetAllProjectList()
        {
            return _commonHRM.Select_Data_List<Common_Project>("Sp_Select_Common_Info", "get_all_projects");
        }

        public List<Common_District> GetAllDistrict()
        {
            return _commonHRM.Select_Data_List<Common_District>("Sp_Select_Common_Info", "get_all_district");
        }

        public List<Common_Unit> GetAllUnit()
        {
            return _commonHRM.Select_Data_List<Common_Unit>("Sp_Select_Common_Info", "get_all_Unit");
        }

        public List<Common_Department> GetAllDepartment()
        {
            return _commonHRM.Select_Data_List<Common_Department>("Sp_Select_Common_Info", "get_all_Department");
        }
        public List<Employees> GetAllEmployee(string companyId)
        {
            return _commonHRM.Select_Data_List<Employees>("Sp_Select_Common_Info", "get_all_Employee", companyId);
        }
    }
}
