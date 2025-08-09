using System.Net;
using System.Text.Json;
using Capital.BL.Exceptions;

namespace Capital.API.Middlevares;

public class ExceptionMiddleware
{
	readonly RequestDelegate _next;
	readonly ILogger<ExceptionMiddleware> _logger; 

	public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger) 
	{
		_logger = logger;
		_next = next; 
	}

	public async Task InvokeAsync(HttpContext context)
	{
		try
		{
			await _next(context); 
		}
        catch (BaseException ex) 
        {
            _logger.LogWarning(ex, "Business exception was catched!");
            await HandleExceptionAsync(context, ex.StatusCode, ex.Message, ex.ErrorCode , ex.Code);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await HandleExceptionAsync(context, HttpStatusCode.InternalServerError, "Unexpected Error!");
        }
    }

	private static async Task HandleExceptionAsync(HttpContext context, HttpStatusCode statusCode, string message , string? errorCode = null, int code = 0)
	{
		context.Response.ContentType = "application/json";
		context.Response.StatusCode = (int)statusCode;

        var errorResponse = new
        {
            message,
            httpStatus = (int)statusCode,
            errorCode,
            businessCode = code,
            traceId = context.TraceIdentifier,
            timestamp = DateTime.UtcNow
        };

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        await context.Response.WriteAsync(JsonSerializer.Serialize(errorResponse, options));

    }
}

