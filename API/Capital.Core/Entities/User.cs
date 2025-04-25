using Microsoft.AspNetCore.Identity;

namespace Capital.Core.Entities; 

public class User : IdentityUser
{
	public string Name { get; set; } = null!;
	public string? Surname { get; set; }
	public bool Gender { get; set; }
	public int Age { get; set; }
}

