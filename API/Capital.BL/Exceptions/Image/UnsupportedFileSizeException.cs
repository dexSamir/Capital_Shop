using Microsoft.AspNetCore.Http;

namespace Capital.BL.Exceptions.Image; 

public class UnsupportedFileSizeException : Exception, IBaseException
{
    public int StatusCode => StatusCodes.Status404NotFound;

    public string ErrorMessage { get; }

	public UnsupportedFileSizeException(int mb)
	{
        ErrorMessage = $"File size must be less than {mb}MB!";
    }

    public UnsupportedFileSizeException(string msg) : base(msg)
    {
        ErrorMessage = msg;
    }

}


