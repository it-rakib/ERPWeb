using System.Collections.Generic;

namespace Entities.HRM
{
    public class Common_Unit
    {
        public int UnitId { get; set; }
        public int CompanyId { get; set; }
        public string UnitName { get; set; }
        public string UnitNameBan { get; set; }
        public bool IsActive { get; set; }
        public string CompanyName { get; set; }
        public string UserId { get; set; }
        public string TerminalId { get; set; }
        public List<int> UnitIds { get; set; }
    }
}
