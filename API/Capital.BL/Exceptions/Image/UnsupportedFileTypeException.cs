using Microsoft.AspNetCore.Http;

namespace Capital.BL.Exceptions.Image; 

public class UnsupportedFileTypeException : Exception, IBaseException
{
    public int StatusCode => StatusCodes.Status404NotFound;

    public string ErrorMessage { get; }

    public UnsupportedFileTypeException()
    {
        ErrorMessage = "File type must be an image!";
    }

    public UnsupportedFileTypeException(string msg) : base(msg)
    {
        ErrorMessage = msg; 
    }
}

