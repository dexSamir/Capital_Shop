using Capital.BL.DTOs.UserDtos;
using Capital.BL.Exceptions.Common;
using Capital.BL.Services.Interfaces;
using Capital.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Capital.BL.Services.Implements;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public UserService(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<IEnumerable<UserGetDto>> GetAllUsersAsync()
    {
        var users = await _userManager.Users.ToListAsync();
        var dtos = new List<UserGetDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            dtos.Add(new UserGetDto
            {
                Id = user.Id,
                Email = user.Email!,
                FullName = $"{user.Name} {user.Surname}".Trim(),
                Roles = roles
            });
        }

        return dtos;
    }

    public async Task AssignRoleAsync(string userId, RoleAssignDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId) ?? throw new NotFoundException<User>();
        if (!await _roleManager.RoleExistsAsync(dto.RoleName))
        {
            throw new BadRequestException("Role does not exist.");
        }

        if (!await _userManager.IsInRoleAsync(user, dto.RoleName))
        {
            await _userManager.AddToRoleAsync(user, dto.RoleName);
        }
    }

    public async Task RemoveRoleAsync(string userId, RoleAssignDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId) ?? throw new NotFoundException<User>();

        if (await _userManager.IsInRoleAsync(user, dto.RoleName))
        {
            await _userManager.RemoveFromRoleAsync(user, dto.RoleName);
        }
    }
}
