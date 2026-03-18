namespace Capital.BL.DTOs.ReviewDtos;

public class ReviewGetDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Comment { get; set; } = null!;
    public int Rating { get; set; }
    public string UserId { get; set; } = null!;
    public string UserName { get; set; } = null!;
    public DateTime CreatedTime { get; set; }
}
