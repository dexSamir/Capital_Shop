using Microsoft.AspNetCore.Http;

namespace Capital.BL.DTOs.ProductDtos;

public class ProductDetailDto
{
	public int Id { get; set; }

    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? SKU { get; set; }

    public int CategoryId { get; set; }
	public int? BrandId { get; set; }

    public string CoverImage { get; set; }
	public string? SecondImage { get; set; }
	public string? VideoUrl { get; set; }

	public decimal SellPrice { get; set; }
	public decimal CostPrice { get; set; }
	public int Discount { get; set; }
    public int Quantity { get; set; }

    public decimal Weight { get; set; }
    public decimal? Length { get; set; }
    public decimal? Width { get; set; }
    public decimal? Height { get; set; }

    //reviews

    //images
	public IEnumerable<string>? Images { get; set; }

    // specifications

    // attributes

    // tags

    // coupon 
}

