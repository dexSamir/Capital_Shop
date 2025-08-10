namespace Capital.BL.DTOs.AttributeDtos.ProductAttributeValueDtos;

public class AssignMultipleAttributeValuesDto
{
    public int ProductId { get; set; }
    public IEnumerable<int> AttributeValueIds { get; set; } = new List<int>();
}

