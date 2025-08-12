namespace Capital.BL.DTOs.Options;

public class JwtOptions
{
	public const string Jwt = "JwtSettings";
	public string Issuer { get; set; }
	public string Audience { get; set; }
	public string SecretKey { get; set; }
}

