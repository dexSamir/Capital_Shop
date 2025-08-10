using Capital.Core.Entities.Base;

namespace Capital.Core.Entities.Relational;

public class ProductAttributeValue : BaseEntity
{
	public int ProductId { get; set; }
	public Product Product { get; set; }

	public int AttributeValueId { get; set; }
	public AttributeValue AttributeValue { get; set; }
}

