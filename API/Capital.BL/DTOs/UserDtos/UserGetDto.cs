namespace Capital.BL.DTOs.UserDtos;

public class UserGetDto
{
    public string Id { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public IList<string> Roles { get; set; } = [];
}
