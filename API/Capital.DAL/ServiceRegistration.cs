using Microsoft.Extensions.DependencyInjection;

namespace Capital.DAL;
public static class ServiceRegistration 
{
	public static IServiceCollection AddRepositories(this IServiceCollection services)
	{
		return services; 
	}
}

