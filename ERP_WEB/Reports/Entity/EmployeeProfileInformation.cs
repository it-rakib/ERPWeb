using System;

namespace ERP_WEB.Reports.Entity
{
    public class EmployeeProfileInformation
    {
        public EmployeeProfileInformation()
        {
            this.Photo = this.Photo ?? Convert.FromBase64String(EmpImage.DefaultImage);
        }

        public long EmpID { get; set; }
        public string EmpCode { get; set; }
        public string PunchNo { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public string NameEng { get; set; }
        public string TitleBan { get; set; }
        public string NameBan { get; set; }
        public string NameBan1 { get; set; }
        public DateTime JoiningDate { get; set; }
        public string DesignationName { get; set; }
        public string PositionName { get; set; }
        public string CompanyName { get; set; }
        public string UnitName { get; set; }
        public string DepartmentName { get; set; }
        public string SectionName { get; set; }
        public string WingName { get; set; }
        public string EmpStatusName { get; set; }
        public string EmpTypeName { get; set; }
        public string EmpCategoryName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string FathersName { get; set; }
        public string MothersName { get; set; }
        public string SpouseName { get; set; }
        public string GenderName { get; set; }
        public string ReligionName { get; set; }
        public string MaritalStatusName { get; set; }
        public string BloodGroupName { get; set; }
        public string NIDNo { get; set; }
        public string BirthCertificateNo { get; set; }
        public string CountryName { get; set; }

        public byte[] Photo { get; set; }
        public string Image64 { get { return Photo != null ? Convert.ToBase64String(Photo) : EmpImage.DefaultImage; } }

        //Employee Contact 
        public string Mobile { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string EmailOffice { get; set; }
        public string EmergContact { get; set; }
        public string EmergContactName { get; set; }
        public string EmergContactAddress { get; set; }
        public string RelationWith { get; set; }
        public string Fax { get; set; }
        public string SocialMediaID { get; set; }
        public string PreVillage { get; set; }
        public string PerVillage { get; set; }
        public string PreRoad { get; set; }
        public string PerRoad { get; set; }
        public string PreDivisionName { get; set; }
        public string PerDivisionName { get; set; }
        public string PreThanaName { get; set; }
        public string PerThanaName { get; set; }
        public string PreDistrictName { get; set; }
        public string PerDistrictName { get; set; }
        public string PrePostOffice { get; set; }
        public string PerPostOffice { get; set; }
        public string PrePostCode { get; set; }
        public string PerPostCode { get; set; }
        public string PreVillageBan { get; set; }
        public string PerVillageBan { get; set; }
        public string PreRoadBan { get; set; }
        public string PerRoadBan { get; set; }
        public string PrePostOfficeBan { get; set; }
        public string PerPostOfficeBan { get; set; }
        public string BusStop { get; set; }
        public string DrivingLicense { get; set; }
        public DateTime DIssueDate { get; set; }
        public DateTime DExpireDate { get; set; }
        public int DAuthorityCountryID { get; set; }


        //
        public string PerAddress { get; set; }
        public string EmpName { get; set; }
        public string UnitAddress { get; set; }
        public string EmpCode1 { get; set; }


    }

    public static class EmpImage
    {
        public static string DefaultImage = "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";
    }
}