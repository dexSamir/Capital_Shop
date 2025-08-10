using Capital.Core.Entities.Base;
namespace Capital.Core.Entities;

public class AttributeValue : BaseEntity
{
	public string Value { get; set; }

	public int AttributeId { get; set; }
	public Attribute Attribute { get; set; }
}

