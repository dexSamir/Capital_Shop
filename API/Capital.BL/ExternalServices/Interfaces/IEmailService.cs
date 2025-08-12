namespace Capital.BL.ExternalServices.Interfaces;

public interface IEmailService
{
    Task<string> GenerateVerificationTokenAsync(string email);
    Task SendVerificationEmailAsync(string email, string token);
    Task<bool> ConfirmEmailAsync(string email, string token);
}

