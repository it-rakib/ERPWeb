using Entities.Core.User;


namespace BLL.Login
{
    public interface ILoginRepository
    {
        UserInfo ValidateUserLogin(string loginId, string password, string terminalId, string sessionId);
        void LogOut(string sessionId);
        PasswordResetInfo ForgotPassword(PasswordResetInfo objForgotPass);
    }
}
