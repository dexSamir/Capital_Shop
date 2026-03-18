namespace Capital.BL.DTOs.ProductDtos;
public class ProductGetDto
{
	public int Id { get; set; }
	public string CoverImage { get; set; }
	public string? SecondImage { get; set; }
	public string? VideoUrl { get; set; }
	public IEnumerable<string>? Images { get; set; }
	public decimal SellPrice { get; set; }
	public int Discount { get; set; }

	public string Title { get; set; }
	public int CategoryId { get; set; }
	public int? BrandId { get; set; }

	//reviews


}

