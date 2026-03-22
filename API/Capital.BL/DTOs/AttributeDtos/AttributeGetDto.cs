namespace Capital.BL.DTOs.AttributeDtos;

public class AttributeGetDto
{
	public int Id { get; set; }
	public string Name { get; set; }
	public DateTime CreatedTime { get; set; }

	public ICollection<AttributeValueGetDto> Values { get; set; }
}

