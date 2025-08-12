using System.Net;

namespace Capital.BL.Exceptions.Common;

public class BadRequestException : BaseException
{
    public BadRequestException(string message, string? errorCode = null, int code = 0)
        : base(message, HttpStatusCode.BadRequest, errorCode, code)
    {
    }
}

public class BadRequestException<T> : BadRequestException
{
    public BadRequestException(string? errorCode = null, int code = 0)
        : base($"{typeof(T).Name} not found", errorCode, code)
    {
    }
}