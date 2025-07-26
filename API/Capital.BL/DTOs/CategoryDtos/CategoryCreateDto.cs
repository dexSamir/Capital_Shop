using Microsoft.AspNetCore.Http;

namespace Capital.BL.DTOs.CategoryDtos;
public class CategoryCreateDto
{
	public string Title { get; set; } = null!; 
	public IFormFile ImageUrl { get; set; } = null!;
}

