namespace Entities.Core.User
{
    public class PasswordResetInfo
    {
        public string EmpCode { get; set; }
        public string EmailOffice { get; set; }
        public string Password { get; set; }
        public string EncryptedPassword { get; set; }
        public string Message { get; set; }
        public string EmpName { get; set; }
    }
}
