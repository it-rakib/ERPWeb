using Entities.Core.User;
using Entities.HRM;
using System;
using System.Net;
using System.Net.Sockets;

namespace ERP_WEB
{
    public class AuditTrail
    {
        /// <summary>
        /// Audit Trail Save into Database
        /// </summary>
        /// <param name="auditTask">Audit Type</param>
        /// <param name="auditDesc">Audit Description</param>
        /// <param name="pageUrl">Page URL</param>
        /// <param name="user">User</param>
        /// <param name="auditedEmpId">EmpId</param>
        ///  <param name="fromDate">From Date</param>
        /// <param name="toDate">To Date</param>
        /// <returns></returns>
        public static AuditTrailEntity GetAuditInfo(string auditTask = "", string auditDesc = "", string pageUrl = "", UserInfo user = null, long auditedEmpId = 0, string fromDate = "", string toDate = "", string empIds = "")
        {
            var audit = new AuditTrailEntity();
            audit.AuditDate = DateTime.Now;
            audit.AuditTask = auditTask;
            audit.AuditDesc = auditDesc;
            audit.UserId = user.USERID ?? "0";
            audit.TerminalId = GetHostName(user.IpAddress);
            audit.IPAddress = GetIpAddress();
            audit.MacAddress = "";
            audit.PageUrl = pageUrl;
            audit.AuditedEmpId = auditedEmpId;
            audit.DateFrom = fromDate;
            audit.DateTo = toDate;
            audit.EmpIds = empIds;
            return audit;

        }
        public static string GetHostName(string ipAddress)
        {
            try
            {
                IPHostEntry entry = Dns.GetHostEntry(ipAddress);
                if (entry != null)
                {
                    return entry.HostName;
                }
            }
            catch (SocketException ex)
            {
                //unknown host or
                //not every IP has a name
                //log exception (manage it)
            }

            return "unknown";
        }
        public static string GetIpAddress()
        {
            string ipAddress = "";
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    ipAddress = ip.ToString();
                }
            }

            return ipAddress;
        }


    }
}