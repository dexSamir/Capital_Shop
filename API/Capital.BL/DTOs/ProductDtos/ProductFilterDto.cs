using Capital.BL.Utilities.Enums;

namespace Capital.BL.DTOs.ProductDtos;

public class ProductFilterDto
{
	public string? Search { get; set; }
	public int? CategoryId { get; set; }
	public int? BrandId { get; set; }

	public decimal? MinPrice { get; set; }
	public decimal? MaxPrice { get; set; }

	public int Page { get; set; }
	public int PageSize { get; set; }

	public ESortDirection SortDirection { get; set; } = ESortDirection.ASC;

    // Sort By Rating
    // Filter By Coupon
    // Filter by size
    // Filter by Gender
	// Filter by Color
	// sort by bestseller
	// sort by most favourite
	// sort by newest to oldest
}

