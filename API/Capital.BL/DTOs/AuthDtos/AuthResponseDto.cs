namespace Capital.BL.DTOs.AuthDtos;

public class AuthResponseDto
{
    public string Token { get; set; } = null!;
    public string Id { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public bool IsAdmin { get; set; }
}

