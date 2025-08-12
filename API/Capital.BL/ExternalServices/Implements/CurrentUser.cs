using System.Security.Claims;
using Capital.BL.Constants;
using Capital.BL.Exceptions.Auth;
using Capital.BL.Exceptions.Common;
using Capital.BL.ExternalServices.Interfaces;
using Capital.Core.Entities;
using Microsoft.AspNetCore.Http;

namespace Capital.BL.ExternalServices.Implements;

public class CurrentUser : ICurrentUser
{

    readonly IHttpContextAccessor _http;
    public CurrentUser(IHttpContextAccessor http)
	{
		_http = http;
    }

    ClaimsPrincipal? User => _http.HttpContext?.User;
    bool IsAuthenticated => User.Identity?.IsAuthenticated ?? false;

    private string GetClaimValue(string claimType)
    {
        if (!IsAuthenticated)
            throw new AuthorisationException<User>();

        var value = User?.FindFirst(claimType)?.Value;
        if (string.IsNullOrEmpty(value))
            throw new NotFoundException<User>();

        return value;
    }

    public IEnumerable<string> GetRoles()
    {
        if (!IsAuthenticated)
            throw new AuthorisationException<User>();

        return User.FindAll(ClaimTypes.Role).Select(c => c.Value);
    }

    public bool IsInRole(string role)
    {
        if (!IsAuthenticated)
            throw new AuthorisationException<User>();

        return User.IsInRole(role);
    }

    public string GetEmail() => GetClaimValue(ClaimType.Email);
    public string GetFullname() => GetClaimValue(ClaimType.Fullname);
    public string GetId() => GetClaimValue(ClaimType.Id);
    public string GetUserName() => GetClaimValue(ClaimType.Username);
}

