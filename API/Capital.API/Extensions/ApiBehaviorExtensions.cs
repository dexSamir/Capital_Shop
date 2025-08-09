using Microsoft.AspNetCore.Mvc;

namespace Capital.API.Extensions;

public static class ApiBehaviorExtensions
{
    public static IServiceCollection ConfigureCustomApiBehavior(this IServiceCollection services)
    {
        services.Configure<ApiBehaviorOptions>(options =>
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                var errors = context.ModelState.Values
                                .SelectMany(v => v.Errors)
                                .Select(e => e.ErrorMessage)
                                .ToList();

                var errorResponse = new
                {
                    message = "Validation Failed",
                    httpStatus = StatusCodes.Status400BadRequest,
                    errorCode = "VALIDATION_ERROR",
                    businessCode = 1001,
                    errors,
                    traceId = context.HttpContext.TraceIdentifier,
                    timestamp = DateTime.UtcNow
                };

                return new BadRequestObjectResult(errorResponse);
            };
        });

        return services;
    }
}
