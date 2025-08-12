namespace Capital.BL.Services.Interfaces;

public interface IAuthService
{
    Task ForgotPasswordAsync(string email);
    Task<bool> ValidateResetCodeAsync(string email, string code);
    Task ResetPasswordAsync(string email, string code, string newPassword);
}

