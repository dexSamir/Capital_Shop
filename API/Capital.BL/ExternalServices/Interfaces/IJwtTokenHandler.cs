using Capital.Core.Entities;

namespace Capital.BL.ExternalServices.Interfaces;

public interface IJwtTokenHandler
{
	string CreateToken(User user, int hours); 
}

