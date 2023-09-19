using DAL.HRM;
using Entities.HRM;

namespace BLL.HRM.AuditTrail
{
    public class AuditTrailService : IAuditTrailRepository
    {
        private AuditTrailDataService _auditTrailDataService = new AuditTrailDataService();
        public void SaveAudit(AuditTrailEntity audit)
        {
            _auditTrailDataService.SaveAudit(audit);
        }
    }
}
