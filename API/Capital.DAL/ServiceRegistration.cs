using Capital.Core.Repositories;
using Capital.DAL.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Capital.DAL;
public static class ServiceRegistration 
{
	public static IServiceCollection AddRepositories(this IServiceCollection services)
	{
		services.AddScoped<ICategoryRepository, CategoryRepository>();
		services.AddScoped<IBrandRepository, BrandRepository>();
		services.AddScoped<IProductRepository, ProductRepository>();
		services.AddScoped<IProductImageRepository, ProductImageRepository>();
		services.AddScoped<IAttributeRepository, AttributeRepository>();
		services.AddScoped<IAttributeValueRepository, AttributeValueRepository>(); 
		services.AddScoped<IProductAttributeValueRepository, ProductAttributeValueRepository>();

		return services; 
	}
}

