using Microsoft.AspNetCore.Http;

namespace Capital.BL.DTOs.CategoryDtos;
public class CategoryUpdateDto
{
    public string? Title { get; set; }
    public IFormFile? ImageUrl { get; set; }
}

