using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Capital.BL.Constants;
using Capital.BL.DTOs.Options;
using Capital.BL.Exceptions.Common;
using Capital.BL.ExternalServices.Interfaces;
using Capital.Core.Entities;
using Capital.DAL.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Capital.BL.ExternalServices.Implements;

public class EmailService : IEmailService
{
    readonly IOptions<SmtpOptions> _opt;
    readonly SmtpOptions _smtp;
    readonly IDistributedCache _cache;
    readonly AppDbContext _context;
    readonly IConfiguration _config; 
	public EmailService(IOptions<SmtpOptions> opt, AppDbContext context, IConfiguration config, IDistributedCache cache)
	{
        _config = config; 
        _context = context; 
        _cache = cache; 
        _opt = opt;
        _smtp = _opt.Value;

	}
    
    public async Task<string> GenerateVerificationTokenAsync(string email)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimType.Email, email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("JwtSettings")["SecretKey"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["JwtSettings:Issuer"],
            audience: _config["JwtSettings:Audience"],
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: credentials);

        var handler = new JwtSecurityTokenHandler();
        return handler.WriteToken(token);
    }

    public async Task SendVerificationEmailAsync(string email, string token)
    {
        string cacheKey = $"email-verification-code:{email}";

        if (await _cache.GetStringAsync(cacheKey) != null)
            throw new Exception("Verification code already sent.");

        var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
        if (user == null)
            throw new NotFoundException<User>();

        string code = GenerateVerificationCode();

        await _cache.SetStringAsync(cacheKey, code, new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15)
        });


        string emailBody = $@"""
<p>Dear User,</p>
    <p>Your verification code is:</p>
    <div style='
        background-color: #1e1e1e;
        color: #d4d4d4;
        font-family: Courier, monospace;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 6px;
        padding: 16px 24px;
        border-radius: 8px;
        width: fit-content;
        margin: 20px 0;
        border: 2px solid #0078d7;
        text-align: center;
    '>{code}</div>
    <p>Please enter this code to verify your email address.</p>
    <p>Thank you,<br/>YourApp Team</p>""";

        SmtpClient smtp = new SmtpClient
        {
            Host = _smtp.Host,
            Port = _smtp.Port,
            EnableSsl = true,
            Credentials = new NetworkCredential(_smtp.Sender, _smtp.Password)
        };

        MailMessage msg = new MailMessage
        {
            From = new MailAddress(_smtp.Sender, "Samir Habibov"),
            Subject = "Your Verification Code",
            Body = emailBody,
            IsBodyHtml = true
        };

        msg.To.Add(email);
        await smtp.SendMailAsync(msg);
    }

    public async Task<bool> ConfirmEmailAsync(string email, string code)
    {
        string cacheKey = $"email-verification-code:{email}";

        var cachedCode = await _cache.GetStringAsync(cacheKey);
        if (cachedCode == null)
            return false; 

        if (!cachedCode.Equals(code))
            return false;

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
            throw new NotFoundException<User>();

        user.IsVerified = true;
        await _context.SaveChangesAsync();

        await _cache.RemoveAsync(email);

        return true;
    }

    public async Task SendPasswordResetCodeAsync(string email, string code)
    {
        var subject = "Your Password Reset Code";
        var body = $@"
        <p>We received a request to reset your password.</p>
        <p>Your password reset code is: <b>{code}</b></p>
        <p>This code will expire in 10 minutes.</p>";

        await SendEmailAsync(email, subject, body);
    }

    private async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        using var smtp = new SmtpClient
        {
            Host = _smtp.Host,
            Port = _smtp.Port,
            EnableSsl = true,
            Credentials = new NetworkCredential(_smtp.Sender, _smtp.Password)
        };

        var msg = new MailMessage
        {
            From = new MailAddress(_smtp.Sender, "Samir Habibov"),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true
        };

        msg.To.Add(to);
        await smtp.SendMailAsync(msg);
    }

    public string GenerateVerificationCode()
    {
        byte[] bytes = new byte[4];
        RandomNumberGenerator.Fill(bytes);
        int value = BitConverter.ToInt32(bytes, 0);
        value = Math.Abs(value % 900000) + 100000;
        return value.ToString();
    }

}

