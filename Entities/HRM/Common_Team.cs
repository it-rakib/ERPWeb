//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Entities.HRM
{
    public class Common_Team
    {
        public int TeamID { get; set; }
        public string TeamName { get; set; }
        public string TeamNameBan { get; set; }
        public bool IsActive { get; set; }

        public int CompanyID { get; set; }
        public int UnitID { get; set; }
        public int DepartmentID { get; set; }
        public int SectionID { get; set; }
        public int WingID { get; set; }
    }
}
