using Microsoft.AspNetCore.Http;
namespace Capital.BL.Exceptions.Common;

public class NotFoundException : Exception, IBaseException
{
    public int StatusCode => StatusCodes.Status404NotFound; 

    public string ErrorMessage { get; }

    public NotFoundException()
    {
        ErrorMessage = "Not Found!"; 
    }

    public NotFoundException(string msg) : base(msg)
    {
        ErrorMessage = msg; 
    }
}

public class NotFoundException<T> : NotFoundException
{
    public NotFoundException() : base(typeof(T).Name + "is not fount!")
    { }
}

