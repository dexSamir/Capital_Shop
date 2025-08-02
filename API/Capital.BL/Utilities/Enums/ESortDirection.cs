using System.Text.Json.Serialization;
namespace Capital.BL.Utilities.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ESortDirection
{
    ASC,
    DESC
}

