namespace Capital.BL.DTOs.ProductImageDto;
public class ProductImageGetDto
{
	public int Id { get; set; }
	public int ProductId { get; set; }

	public string ImageUrl { get; set; }
	public DateTime CreatedTime { get; set; }
	public bool isDeleted { get; set; }
	public bool isUpdated { get; set; }
	public DateTime UpdatedTime { get; set; }

	public bool IsPrimary { get; set; }
	public bool IsSecondary { get; set; }
	public string AltText { get; set; }
}

