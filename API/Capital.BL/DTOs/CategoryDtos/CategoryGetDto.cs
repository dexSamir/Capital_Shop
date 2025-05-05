namespace Capital.BL.DTOs.CategoryDtos;
public class CategoryGetDto
{
	public Guid Id { get; set; }
	public string Title { get; set; }
	public string ImageUrl { get; set; }

	public bool isDeleted { get; set; }
	public bool isUpdated { get; set; }
	public DateTime CreatedTime { get; set; }
    public DateTime? UpdatedTime { get; set; }
}

