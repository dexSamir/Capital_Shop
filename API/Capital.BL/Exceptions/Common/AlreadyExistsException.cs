using System.Net;

namespace Capital.BL.Exceptions.Common;

public class AlreadyExistsException : BaseException
{
    public AlreadyExistsException(string message, string? errorCode = null, int code = 0)
        : base(message, HttpStatusCode.Conflict, errorCode, code)
    {
    }
}

public class AlreadyExistsException<T> : AlreadyExistsException
{
    public AlreadyExistsException(string? errorCode = null, int code = 0)
        : base($"{typeof(T).Name} is already exists!", errorCode, code)
    {
    }
}