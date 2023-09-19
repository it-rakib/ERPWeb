namespace Entities.HRM
{
    public class UserPermission
    {
        public string Result { get; set; }
        public bool IsCompanyPermission { get; set; } = false;
        public bool IsUnitPermission { get; set; } = false;
    }
}
