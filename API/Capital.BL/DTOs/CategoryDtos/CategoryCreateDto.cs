using Microsoft.AspNetCore.Http;

namespace Capital.BL.DTOs.CategoryDtos;
public class CategoryCreateDto
{
	public string Title { get; set; }
	public IFormFile ImageUrl { get; set; }
}

