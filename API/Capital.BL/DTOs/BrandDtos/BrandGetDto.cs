namespace Capital.BL.DTOs.BrandDtos;

public class BrandGetDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string LogoUrl { get; set; }
    public string Website { get; set; }

    public bool isDeleted { get; set; }
    public bool isUpdated { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime? UpdatedTime { get; set; }
}

