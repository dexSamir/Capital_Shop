using Microsoft.AspNetCore.Http;
namespace Capital.BL.DTOs.BrandDtos;

public class BrandCreateDto
{
	public string Title { get; set; }
	public string Website { get; set; }
	public IFormFile LogoUrl { get; set; }

}

