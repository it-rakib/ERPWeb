namespace Entities.HRM
{
    public class Common_Section
    {
        public int SectionID { get; set; }
        public string SectionName { get; set; }
        public string SectionNameBan { get; set; }
        public bool IsActive { get; set; }
        public int CompanyID { get; set; }
        public int UnitID { get; set; }
        public int DepartmentID { get; set; }
    }
}
