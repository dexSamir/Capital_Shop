
using Microsoft.AspNetCore.Http;

namespace Capital.BL.Exceptions.Common;
public class UnsupportedDeleteTypeException : Exception, IBaseException
{
    public int StatusCode => StatusCodes.Status400BadRequest; 

    public string ErrorMessage { get; }


    public UnsupportedDeleteTypeException()
    {
        ErrorMessage = "Unsupported Delete Type!"; 
    }

    public UnsupportedDeleteTypeException(string msg) : base(msg)
    {
        ErrorMessage = msg; 
    }

}


