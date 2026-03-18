using Capital.BL.DTOs.UserDtos;

namespace Capital.BL.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserGetDto>> GetAllUsersAsync();
    Task AssignRoleAsync(string userId, RoleAssignDto dto);
    Task RemoveRoleAsync(string userId, RoleAssignDto dto);
}
