namespace Capital.BL.DTOs.CategoryDtos;
public class CategoryGetDto
{
	public int Id { get; set; }
	public string Title { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;

    public bool isDeleted { get; set; }
	public bool isUpdated { get; set; }
	public DateTime CreatedTime { get; set; }
    public DateTime? UpdatedTime { get; set; }
}

