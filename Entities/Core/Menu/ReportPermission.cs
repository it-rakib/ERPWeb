namespace Entities.Core.Menu
{
    public class ReportPermission
    {
        public int ReportPermissionId { get; set; }
        public int MenuId { get; set; }
        public string MenuName { get; set; }
        public int ReportId { get; set; }
        public int ReportCode { get; set; }
        public string ReportName { get; set; }
        public string UsrName { get; set; }
        public string UserId { get; set; }

    }
}
