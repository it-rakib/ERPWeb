using DAL.Common;
using DAL.HRM;
using DBManager;
using Entities.HRM;
using Entities.HRM.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace BLL.HRM.Common
{
    public class CommonService : ICommonRepository
    {
        private readonly HrmCommonDataService _commonDataService = new HrmCommonDataService();

        SqlDataAdapter da;
        SqlConnection dbConn;
        SqlCommand cmd;
        DataSet ds;
        DataTable dt;
        string ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["SqlConnectionStringHRM"].ConnectionString;
        readonly CommonDataServiceHRM _common = new CommonDataServiceHRM();

        public List<PaymentMode> GetAllPaymentMode()
        {
            return _commonDataService.GetAllPaymentMode();
        }

        public List<CurrencyType> GetAllCurrency()
        {
            return _commonDataService.GetAllCurrency();
        }

        public List<BankInfo> GetAllBank()
        {
            return _commonDataService.GetAllBank();
        }

        public List<Common_Company> GetAllSalaryPayCompany()
        {
            return _commonDataService.GetAllSalaryPayCompany();
        }

        public List<BankBranchInfo> GetAllBranchByBank(int bankId)
        {
            return _commonDataService.GetAllBranchByBank(bankId);
        }



        public List<Formula> GetAllFormula()
        {
            return _commonDataService.GetAllFormula();
        }

        public List<Common_AllType> GetAllIncrementType()
        {
            return _commonDataService.GetAllIncrementType();
        }

        public List<Common_AllType> GetAllUserLevel(string empid)
        {
            return _commonDataService.GetAllUserLevel(empid);
        }

        public List<Common_Project> GetAllProjectList()
        {
            return _commonDataService.GetAllProjectList();
        }

        public List<Common_District> GetAllDistrict()
        {
            return _commonDataService.GetAllDistrict();
        }

        public List<Common_Unit> GetAllUnit()
        {
            return _commonDataService.GetAllUnit();
        }

        public HRMMode GetHRMMode(int unitId)
        {
            var data = _commonDataService.GetHRMMode(unitId);

            if (data == null)
            {
                data = new HRMMode();
                data.HRMModeId = 1;
                data.HRMModeName = "Normal Mode";
            }
            return data;
        }

        public string SaveHRMMode(HRMMode objHrmMode)
        {
            string rv = "";
            try
            {
                Insert_Update_HrmMode("sp_Insert_HrmMode", "saveHrmModeinfo", objHrmMode);
                rv = Operation.Success.ToString();
            }
            catch (Exception ex)
            {
                rv = ex.Message;
            }
            return rv;
        }



        public DataTable Insert_Update_HrmMode(string procedure, string callname, HRMMode objHrmMode)
        {
            dbConn = new SqlConnection(ConnectionString);
            dbConn.Open();
            cmd = new SqlCommand(procedure, dbConn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add(new SqlParameter("@call_name", callname));
            cmd.Parameters.Add(new SqlParameter("@p_UnitId", objHrmMode.UnitId));
            cmd.Parameters.Add(new SqlParameter("@p_HRMModeId", objHrmMode.HRMModeId));
            cmd.Parameters.Add(new SqlParameter("@p_UserId", objHrmMode.UserId));
            da = new SqlDataAdapter(cmd);
            dt = new DataTable();
            da.Fill(dt);
            dbConn.Close();
            return dt;
        }

        public List<Common_Department> GetAllDepartment()
        {
            return _commonDataService.GetAllDepartment();
        }

        public List<Employees> GetAllEmployee(string companyId)
        {
            return _commonDataService.GetAllEmployee(companyId);
        }
    }
}
