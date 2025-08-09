using System.Net;
namespace Capital.BL.Exceptions.Image; 

public class UnsupportedFileSizeException : BaseException
{
    public UnsupportedFileSizeException(string message, string? errorCode = null)
            : base(message, HttpStatusCode.NotFound, errorCode)
    {
    }

}


