using System;

namespace Entities.Core.NoticeSetting
{
    public class NoticeInfo
    {
        public int NoticeId { get; set; }
        public string Subject { get; set; }
        public string Details { get; set; }
        public DateTime Date { get; set; }
        public string UsrId { get; set; }
        public string TermId { get; set; }
        public string UsrSeson { get; set; }
        public string SaveStatus { get; set; }
    }
}
