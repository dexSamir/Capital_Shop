using System.Net;
using Capital.BL.Exceptions.Common;

namespace Capital.BL.Exceptions.Auth;

public class AuthorisationException : BaseException
{
    public AuthorisationException(string message, string? errorCode = null, int code = 0)
        : base(message, HttpStatusCode.NotFound, errorCode, code)
    {
    }
}

public class AuthorisationException<T> : AuthorisationException
{
    public AuthorisationException(string? errorCode = null, int code = 0)
        : base($"{typeof(T).Name} not logged in!", errorCode, code)
    {
    }
}