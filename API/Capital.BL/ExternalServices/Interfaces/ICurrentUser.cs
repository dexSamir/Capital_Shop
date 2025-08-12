namespace Capital.BL.ExternalServices.Interfaces;

public interface ICurrentUser
{
    string GetId();
    string GetUserName();
    string GetEmail();
    string GetFullname();
}

