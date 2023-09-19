using DAL.Common;
using DBManager;
using Entities.LAND.ReportEntity;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.LAND.Reports
{
    public class LandReportDataService
    {
        private SqlDataAdapter da;
        private SqlConnection dbConn;
        private SqlCommand cmd;
        private DataSet ds;
        private DataTable dt;
        private readonly CommonDataService _common = new CommonDataService("LANDDBConnectionString");

        private string ConnectionString = ConfigurationManager.ConnectionStrings["LANDDBConnectionString"].ConnectionString;
        public DataSet GetDistrictWiseReport()
        {
            return _common.select_data_10("","Sp_LandReport", "get_district_wise_report");
        }
        public DataSet GetUpozilaWiseReport()
        {
            return _common.select_data_10("", "Sp_UpozilaReport", "get_upozila_wise_report");
        }
        public DataSet GetUpozilaWiseMutationReport(Guid upozilaId)
        {
            return _common.select_data_10("", "Sp_UpozilaMutationReport", "get_upozila_wise_mutation_report",upozilaId.ToString());
        }
        public DataSet GetMouzaWiseReport()
        {
            return _common.select_data_10("", "Sp_MouzaReport", "get_mouza_wise_report");
        }
        public DataSet GetOwnerWiseReport()
        {
            return _common.select_data_10("", "Sp_OwnerReport", "get_owner_wise_report");
        }
        public DataSet GetFileWiseReport()
        {
            return _common.select_data_10("", "Sp_FileReport", "get_file_wise_report");
        }

        public DataSet GetDivisionWiseReport(Guid divisionId)
        {
            return _common.select_data_10("", "Sp_DivisionReport", "get_division_wise_report", divisionId.ToString());
        }
        public DataSet GetDivisionWiseMutationReport(Guid divisionId)
        {
            return _common.select_data_10("", "Sp_DivisionReport", "get_division_wise_mutation_report", divisionId.ToString());
        }
        public DataSet GetDistrictWiseSingleReport(Guid districtId)
        {
            return _common.select_data_10("", "Sp_SingleDistrictReport", "get_singledistrict_wise_report", districtId.ToString());
        }
        public DataSet GetDistrictWiseSingleMutationReport(Guid districtId)
        {
            return _common.select_data_10("", "Sp_SingleDistrictReport", "get_singledistrict_wise_mutation_report", districtId.ToString());
        }

        public DataSet GetMouzaWiseMutationReport(Guid mouzaId)
        {
            return _common.select_data_10("", "Sp_MouzaWiseMutationReport", "get_mouza_wise_mutation_report", mouzaId.ToString());
        }
        public DataSet GetSingleOwnerWiseMutationSummaryReport(Guid ownerInfoId)
        {
            return _common.select_data_10("", "Sp_SingleOwnerReport", "get_singleowner_wise_mutation_summary_report", ownerInfoId.ToString());
        }

        public DataSet GetUpozilaWiseSingleReport(Guid upozilaId)
        {
            return _common.select_data_10("", "Sp_SingleUpozilaReport", "get_singleupozila_wise_report", upozilaId.ToString());
        }
        public DataSet GetMouzaWiseSingleReport(Guid mouzaId)
        {
            return _common.select_data_10("", "Sp_SingleMouzaReport", "get_singlemouza_wise_report", mouzaId.ToString());
        }
        public DataSet GetOwnerWiseSingleReport(Guid mouzaId,Guid ownerInfoId)
        {
            return _common.select_data_10("", "Sp_SingleOwnerReport", "get_singleowner_wise_report", mouzaId.ToString(), ownerInfoId.ToString());
        }

        public DataSet GetOwnerWiseSingleSummaryReport(Guid ownerInfoId)
        {
            return _common.select_data_10("", "Sp_SingleOwnerReport", "get_singleowner_wise_summary_report",ownerInfoId.ToString());
        }
        public DataSet GetOwnerWiseMutationReport(Guid mouzaId, Guid ownerInfoId)
        {
            return _common.select_data_10("", "Sp_SingleOwnerReport", "get_owner_mutation_wise_report", mouzaId.ToString(), ownerInfoId.ToString());
        }

    }
}
