namespace Capital.BL.DTOs.ReviewDtos;

public class ReviewUpdateDto
{
    public string Comment { get; set; } = null!;
    // Maybe allow updating rating and images in future, for now just comment or rating
    public int? Rating { get; set; }
}
