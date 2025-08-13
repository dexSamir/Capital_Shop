using System.Security.Cryptography;
using Capital.BL.DTOs.AuthDtos;
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
    readonly UserManager<User> _userManager;
    readonly SignInManager<User> _signInManager; 
    readonly IDistributedCache _cache;
    readonly IEmailService _emailService;
    readonly ILogger<AuthService> _logger;
    readonly IJwtTokenHandler _tokenHandler;

    private const string ResetCodePrefix = "reset_code_";
    private const int CodeExpiryMinutes = 10;

    public AuthService(UserManager<User> userManager,
                       IDistributedCache cache,
                       IEmailService emailService,
                       ILogger<AuthService> logger,
                       SignInManager<User> signInManager,
                       IJwtTokenHandler tokenHandler)
    {
        _tokenHandler = tokenHandler; 
        _signInManager = signInManager; 
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

        var code = _emailService.GenerateVerificationCode();
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


    public async Task<string> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.EmailOrUserName) ??
            await _userManager.FindByNameAsync(dto.EmailOrUserName);

        if (user is null)
            throw new NotFoundException<User>();

        var result = await _signInManager.PasswordSignInAsync(user, dto.Password, dto.RememberMe, true);

        if (!result.Succeeded)
            throw new NotFoundException<User>();

        return _tokenHandler.CreateToken(user, 24);
    }

    public Task RegisterAsync()
    {
        throw new NotImplementedException();
    }


    public async Task<bool> VerifyAccountAsync(string email, string token)
        => await _emailService.ConfirmEmailAsync(email, token);

    public async Task<string> SendVerificationEmailAsync(string email, string token)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            throw new NotFoundException<User>();

        await _emailService.SendVerificationEmailAsync(email, token);

        return "Verification email sent.";
    }
}

