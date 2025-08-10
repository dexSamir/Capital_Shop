using Capital.Core.Entities.Base;

namespace Capital.Core.Entities;

public class Attribute : BaseEntity
{
    public string Name { get; set; } = null!;
    public ICollection<AttributeValue> Values { get; set; } 
}
