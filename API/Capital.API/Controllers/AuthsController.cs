using Capital.BL.DTOs.AuthDtos;
using Capital.BL.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Capital.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
    {
        await _authService.ForgotPasswordAsync(dto.Email);
        return NoContent();
    }

    [HttpPost("validate-reset-code")]
    [AllowAnonymous]
    public async Task<IActionResult> ValidateResetCode(ValidateResetCodeDto dto)
    {
        var isValid = await _authService.ValidateResetCodeAsync(dto.Email, dto.Code);
        if (!isValid) return BadRequest(new { message = "Invalid or expired code" });
        return Ok();
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
    {
        await _authService.ResetPasswordAsync(dto.Email, dto.Code, dto.NewPassword);
        return NoContent();
    }
}
