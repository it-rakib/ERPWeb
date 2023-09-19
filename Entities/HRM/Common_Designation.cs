namespace Entities.HRM
{
    public class Common_Designation
    {
        public int DesignationID { get; set; }
        public string DesignationName { get; set; }
        public string DesignationNameBan { get; set; }
        public int DesGroupID { get; set; }
        public byte Grade { get; set; }
        public int OrderBy { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public string DesGroupName { get; set; }
    }
}
