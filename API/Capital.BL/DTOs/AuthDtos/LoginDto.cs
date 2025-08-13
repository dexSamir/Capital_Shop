namespace Capital.BL.DTOs.AuthDtos;

public class LoginDto
{
	public string EmailOrUserName { get; set; }
	public string Password { get; set; }
	public bool RememberMe { get; set; }
}

