namespace Entities.Core.Menu
{
    public class UserAccessPermission
    {
        public int AccessPermissionId { get; set; }
        public int UserId { get; set; }
        public int MenuId { get; set; }
        public int CanInsert { get; set; }
        public int CanEdit { get; set; }
        public int CanDelete { get; set; }
        public int CanView { get; set; }
        public string EntryUserId { get; set; }
        public string TerminalId { get; set; }
        public string ReturnStatus { get; set; }

    }
}
