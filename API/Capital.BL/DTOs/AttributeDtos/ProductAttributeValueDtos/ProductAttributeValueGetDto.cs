namespace Capital.BL.DTOs.AttributeDtos.ProductAttributeValueDtos;

public class ProductAttributeValueGetDto
{
	public int Id { get; set; }

	public int ProductId { get; set; }
	public int AttributeValueId { get; set; }

	public string ProductName { get; set; }
	public string AttributeValue { get; set; }
}

