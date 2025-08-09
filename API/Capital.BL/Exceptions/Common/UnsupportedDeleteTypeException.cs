
using System.Net;

namespace Capital.BL.Exceptions.Common;
public class UnsupportedDeleteTypeException : BaseException 
{
    public UnsupportedDeleteTypeException(string message, string? errorCode = null, int code = 0)
        : base(message, HttpStatusCode.NotFound, errorCode, code)
    {
    }
}


