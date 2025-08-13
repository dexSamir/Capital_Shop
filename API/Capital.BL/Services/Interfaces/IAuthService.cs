using Capital.BL.DTOs.AuthDtos;

namespace Capital.BL.Services.Interfaces;

public interface IAuthService
{
    Task ForgotPasswordAsync(string email);
    Task<bool> ValidateResetCodeAsync(string email, string code);
    Task ResetPasswordAsync(string email, string code, string newPassword);

    Task<string> LoginAsync(LoginDto dto);
    Task RegisterAsync();
    Task<bool> VerifyAccountAsync(string email, string token);
    Task<string> SendVerificationEmailAsync(string email, string token);
}

