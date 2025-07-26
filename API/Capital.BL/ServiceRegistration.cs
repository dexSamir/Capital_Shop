using Capital.BL.ExternalServices.Implements;
using Capital.BL.ExternalServices.Interfaces;
using Capital.BL.OtherServices.Implements;
using Capital.BL.OtherServices.Interfaces;
using Capital.BL.Services.Implements;
using Capital.BL.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Capital.BL;
public static class ServiceRegistration
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<ICategoryService, CategoryService>();

        services.AddScoped<ICacheService, CacheService>();
        services.AddScoped<IFileService, FileService>(); 
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

