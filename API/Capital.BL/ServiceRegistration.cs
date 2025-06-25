using Capital.BL.Services.Implements;
using Capital.BL.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Capital.BL;
public static class ServiceRegistration
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<ICategoryService, CategoryService>();

        return services;
    }

    public static IServiceCollection AddMapper(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(ServiceRegistration));
        return services; 
    }

    public static IServiceCollection AddCache(this IServiceCollection services)
    {
        services.AddDistributedMemoryCache(); 
        return services; 
    }
}

