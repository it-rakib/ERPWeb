using DBManager;
using Entities.Core.NoticeSetting;
using Entities.Core.User;
using System.Collections.Generic;

namespace BLL.Core.Notice
{
    public interface INoticeSettingRepository
    {
        List<Entities.Core.NoticeSetting.NoticeInfo> GetNoticeData();
        GridEntity<Entities.Core.NoticeSetting.NoticeInfo> GetNoticeSummary(GridOptions options);
        NoticeInfo SaveNoticeInfo(NoticeInfo objNotice, UserInfo user);
    }
}
