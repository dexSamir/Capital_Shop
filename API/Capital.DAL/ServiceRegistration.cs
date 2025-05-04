using Capital.Core.Repositories;
using Capital.DAL.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Capital.DAL;
public static class ServiceRegistration 
{
	public static IServiceCollection AddRepositories(this IServiceCollection services)
	{
		services.AddScoped<ICategoryRepository, CategoryRepository>(); 

		return services; 
	}
}

