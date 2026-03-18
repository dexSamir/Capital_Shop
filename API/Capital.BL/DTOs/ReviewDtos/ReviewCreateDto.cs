namespace Capital.BL.DTOs.ReviewDtos;

public class ReviewCreateDto
{
    public int ProductId { get; set; }
    public string Comment { get; set; } = null!;
    public int Rating { get; set; }
    public IEnumerable<Microsoft.AspNetCore.Http.IFormFile>? Images { get; set; }
}
