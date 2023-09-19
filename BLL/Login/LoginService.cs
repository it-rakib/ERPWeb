using AUtilities;
using DAL.Login;
using DBManager;
using Entities.Core.User;
using System;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;


namespace BLL.Login
{
    public class LoginService : ILoginRepository
    {
        readonly LoginDataService _loginDataService = new LoginDataService();


        public UserInfo ValidateUserLogin(string loginId, string password, string terminalId, string sessionId)
        {
            string username = loginId.Trim().ToUpper();
            string userpass = password.Trim();
            string UserPass = EncryptDecryptManager.Encrypt(userpass, true);
            return _loginDataService.GetUserById(username, UserPass, terminalId, sessionId);
        }

        public void LogOut(string sessionId)
        {
            _loginDataService.LogOut(sessionId);
        }

        public PasswordResetInfo ForgotPassword(PasswordResetInfo objForgotPass)
        {
            Random generator = new Random();
            String radDomPass = generator.Next(0, 999999).ToString("D6");
            objForgotPass.Password = radDomPass;

            string pass = radDomPass.Trim();
            string encryptedPassWord = EncryptDecryptManager.Encrypt(pass, true);
            objForgotPass.EncryptedPassword = encryptedPassWord;
            var res = _loginDataService.ForgotPassword(objForgotPass);
            objForgotPass.EmpName = res.EmpName;
            if (res.Message == Operation.Success.ToString())
            {
                try
                {
                    SendEmail(objForgotPass);
                }
                catch (Exception)
                {
                    res.Message = "Mail Send Failed";
                }
            }
            return res;
        }

        public void SendEmail(PasswordResetInfo objForgotPass)
        {
            MailMessage message = new MailMessage(new MailAddress("itsupport@hameemgroup.com", "IT Support"), new MailAddress(objForgotPass.EmailOffice, ""));
            message.Subject = "Password Reset";
            message.Body = "<div style='font-family:Trebuchet MS;'>";
            message.Body += "Dear " + objForgotPass.EmpName + ",";
            message.Body += "<br /><br />";
            message.Body += "Your Temporary Password is <b style='font-size:30px;'>" + objForgotPass.Password + "</b>";
            message.Body += "<br /><br />";
            message.Body += "Please change password after first login.";
            message.Body += "<br /><br />";
            message.Body += "Thanks,";
            message.Body += "<br />";
            message.Body += "IT Support";
            message.Body += "<br /><br />";
            message.Body += "</div>";
            message.IsBodyHtml = true;
            SmtpClient mailSmtp = new SmtpClient("mail.hameemgroup.com");
            mailSmtp.EnableSsl = false;
            mailSmtp.Port = 465;
            mailSmtp.Credentials = new System.Net.NetworkCredential("delwar", "del#ro%se$89!h9");
            mailSmtp.Send(message);
        }

        public static string EncodeMD5(string originalStr)
        {
            Byte[] originalBytes;
            Byte[] encodedBytes;
            MD5 md5 = new MD5CryptoServiceProvider();
            originalBytes = ASCIIEncoding.Default.GetBytes(originalStr);
            encodedBytes = md5.ComputeHash(originalBytes);
            return BitConverter.ToString(encodedBytes);
        }
        public static string StrReverse(string s)
        {
            char[] arr = s.ToCharArray();
            Array.Reverse(arr);
            return new string(arr);
        }
    }
}
