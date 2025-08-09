using System.Net;

namespace Capital.BL.Exceptions.Image; 

public class UnsupportedFileTypeException : BaseException
{
    public UnsupportedFileTypeException(string message, string? errorCode = null)
            : base(message, HttpStatusCode.NotFound, errorCode)
    {
    }
}

