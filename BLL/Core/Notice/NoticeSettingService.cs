using DAL.Core;
using DBManager;
using Entities.Core.NoticeSetting;
using Entities.Core.User;
using System.Collections.Generic;

namespace BLL.Core.Notice
{
    public class NoticeSettingService : INoticeSettingRepository
    {
        readonly NoticeSettingDataService _noticeSettingDataService = new NoticeSettingDataService();
        public List<NoticeInfo> GetNoticeData()
        {
            return _noticeSettingDataService.GetNoticeData();
        }

        public GridEntity<NoticeInfo> GetNoticeSummary(GridOptions options)
        {
            return _noticeSettingDataService.GetNoticeSummary(options);
        }

        public NoticeInfo SaveNoticeInfo(NoticeInfo objNotice, UserInfo user)
        {
            return _noticeSettingDataService.SaveNoticeInfo(objNotice, user);
        }
    }
}
