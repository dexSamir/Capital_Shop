using Capital.BL.DTOs.UserDtos;
using Capital.BL.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Capital.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpPost("{id}/roles")]
    public async Task<IActionResult> AssignRole(string id, [FromBody] RoleAssignDto dto)
    {
        await _userService.AssignRoleAsync(id, dto);
        return Ok(new { message = "Role assigned successfully." });
    }

    [HttpDelete("{id}/roles")]
    public async Task<IActionResult> RemoveRole(string id, [FromBody] RoleAssignDto dto)
    {
        await _userService.RemoveRoleAsync(id, dto);
        return Ok(new { message = "Role removed successfully." });
    }
}
