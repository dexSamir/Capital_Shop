using System.Net;
using Microsoft.AspNetCore.Http;

namespace Capital.BL.Exceptions;

public abstract class BaseException : Exception
{
    public HttpStatusCode StatusCode { get; }
    public int Code { get; }
    public string? ErrorCode { get; }

    protected BaseException(string message, HttpStatusCode statusCode, string? errorCode = null, int code = 0)
        : base(message)
    {
        StatusCode = statusCode;
        ErrorCode = errorCode;
        Code = code; 
    }
}

