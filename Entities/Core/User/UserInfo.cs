using System;

namespace Entities.Core.User
{
    public class UserInfo

    {

        public string USERID { get; set; }
        public string EMPID { get; set; }//userid
        public string USERNAME { get; set; }
        public string USRPASS { get; set; }
        public string TermID { get; set; }
        public string USRTYPE { get; set; }
        public string USRDESIG { get; set; }
        public int COMPANYID { get; set; }
        public int UNITID { get; set; }
        public int BRANCHID { get; set; }
        public string COMPANYNAME { get; set; }
        public string BRANCHNAME { get; set; }
        public string COMPANYCODE { get; set; }
        public string BRANCHCODE { get; set; }
        public string SECTIONID { get; set; }
        public string WINGID { get; set; }
        public string TEAMID { get; set; }
        public string USERTYPE { get; set; }
        public string USERLEVELID { get; set; }

        public int EMPNO { get; set; }
        public bool ISLEAVEAPPROVER { get; set; }
        public int EMPCATEGORYID { get; set; }
        public bool ISSITEDUTYAPPROVER { get; set; }
        public int ROOTCOMPANYID { get; set; }

        public bool ISINOUTAPPROVER { get; set; }
        public bool ISLEAVEFORWARDER { get; set; }
        public bool ISSITEDUTYFORWARDER { get; set; }
        public bool ISINOUTFORWARDER { get; set; }
        public bool ISLEAVEPOLICYCHECKER { get; set; }
        public int ModuleId { get; set; }

        public byte[] Photo { get; set; }
        public string Image64 { get { return Photo != null ? Convert.ToBase64String(Photo) : null; } }
        public string IpAddress { get; set; }

        public bool IsSetPass { get; set; }
    }
}
