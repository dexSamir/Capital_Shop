
using Microsoft.AspNetCore.Http;

namespace Capital.BL.DTOs.ProductDtos;
public class ProductCreateDto
{
    public decimal SellPrice { get; set; }
    public decimal CostPrice { get; set; }
    public int Discount { get; set; }
    public int Quantity { get; set; }
    public string SKU { get; set; }

    public string Title { get; set; }
    public string Description { get; set; }

    public IFormFile? CoverImage { get; set; }
    public IFormFile? SecondImage { get; set; }

    public int BrandId { get; set; }
    public int CaategoryId { get; set; }

    public decimal Weight { get; set; }
    public decimal? Length { get; set; }
    public decimal? Width { get; set; }
    public decimal? Height { get; set; }
}

