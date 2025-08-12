namespace Capital.BL.DTOs.ProductSpecificationDtos;

public class ProductSpecificationGetDto
{
    public int Id { get; set; }
    public string Key { get; set; }
    public string Value { get; set; }
    public int ProductId { get; set; }
    public DateTime CreatedTime { get; set; }
}

