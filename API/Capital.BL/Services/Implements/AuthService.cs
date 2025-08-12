using System.Security.Cryptography;
using Capital.BL.Exceptions.Common;
using Capital.BL.ExternalServices.Interfaces;
using Capital.BL.Services.Interfaces;
using Capital.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace Capital.BL.Services.Implements;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly IDistributedCache _cache;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthService> _logger;

    private const string ResetCodePrefix = "reset_code_";
    private const int CodeExpiryMinutes = 10;

    public AuthService(UserManager<User> userManager,
                       IDistributedCache cache,
                       IEmailService emailService,
                       ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _cache = cache;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task ForgotPasswordAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email) ?? throw new NotFoundException<User>();
        if (user == null)
        {
            _logger.LogWarning("Password reset requested for non-existing email: {email}", email);
            return;
        }

        var code = Generate6DigitCode();
        await _cache.SetStringAsync(
            ResetCodePrefix + email.ToLower(),
            code,
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(CodeExpiryMinutes)
            }
        );

        await _emailService.SendPasswordResetCodeAsync(email, code);
    }

    public async Task<bool> ValidateResetCodeAsync(string email, string code)
    {
        var cachedCode = await _cache.GetStringAsync(ResetCodePrefix + email.ToLower());
        return cachedCode != null && cachedCode == code;
    }

    public async Task ResetPasswordAsync(string email, string code, string newPassword)
    {
        var user = await _userManager.FindByEmailAsync(email)
                   ?? throw new NotFoundException("User not found");

        var cachedCode = await _cache.GetStringAsync(ResetCodePrefix + email.ToLower());
        if (cachedCode == null || cachedCode != code)
        {
            throw new BadRequestException("Invalid or expired reset code");
        }

        var result = await _userManager.RemovePasswordAsync(user);
        if (!result.Succeeded)
            throw new BadRequestException(result.Errors.FirstOrDefault()?.Description ?? "Error removing password");

        result = await _userManager.AddPasswordAsync(user, newPassword);
        if (!result.Succeeded)
            throw new BadRequestException(result.Errors.FirstOrDefault()?.Description ?? "Error setting new password");

        await _cache.RemoveAsync(ResetCodePrefix + email.ToLower());
    }

    private string Generate6DigitCode()
    {
        byte[] bytes = new byte[4];
        RandomNumberGenerator.Fill(bytes);
        int value = BitConverter.ToInt32(bytes, 0);
        value = Math.Abs(value % 900000) + 100000;
        return value.ToString();
    }
}

