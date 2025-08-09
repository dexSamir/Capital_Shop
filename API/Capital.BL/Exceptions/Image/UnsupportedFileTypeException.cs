using System.Net;

namespace Capital.BL.Exceptions.Image; 

public class UnsupportedFileTypeException : BaseException
{
    public UnsupportedFileTypeException(string message, string? errorCode = null, int code = 0)
        : base(message, HttpStatusCode.NotFound, errorCode, code)
    {
    }
}

