using Microsoft.AspNetCore.Http;
namespace Capital.BL.DTOs.ProductImageDto;

public class ProductImageCreateDto
{
	public IFormFile ImageUrl { get; set; }
	public bool IsPrimary { get; set; } = false; 
	public bool IsSecondary { get; set; } = false;
	public string AltText { get; set; }
	public int ProductId { get; set; }
}

