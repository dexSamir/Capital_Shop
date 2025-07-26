using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Capital.BL.Utilities.Enums;
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum EDeleteType
{
    [Display(Name = "Soft Delete")]
    Soft,
    [Display(Name = "Hard Delete")]
    Hard,
    [Display(Name = "Reverse Delete")]
    Reverse
}

