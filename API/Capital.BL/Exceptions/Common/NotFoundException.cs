using System.Net;
namespace Capital.BL.Exceptions.Common;

public class NotFoundException : BaseException
{
    public NotFoundException(string message, string? errorCode = null, int code = 0)
        : base(message, HttpStatusCode.NotFound, errorCode, code)
    {
    }
}

public class NotFoundException<T> : NotFoundException
{
    public NotFoundException(string? errorCode = null, int code = 0)
        : base($"{typeof(T).Name} not found", errorCode, code)
    {
    }
}

