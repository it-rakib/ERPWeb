namespace Entities.HRM
{
    public class Common_JobLocation
    {
        public int JobLocationId { get; set; }
        public string JobLocationName { get; set; }
        public string JobLocationNameBan { get; set; }
        public string JobLocationShortName { get; set; }
        public string JobLocationAdress { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }
        public string TerminalId { get; set; }
    }
}
