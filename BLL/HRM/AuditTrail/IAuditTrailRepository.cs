using Entities.HRM;

namespace BLL.HRM.AuditTrail
{
    public interface IAuditTrailRepository
    {
        void SaveAudit(AuditTrailEntity audit);
    }
}
