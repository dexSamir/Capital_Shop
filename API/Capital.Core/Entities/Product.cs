using Capital.Core.Entities.Base;
namespace Capital.Core.Entities;

public class Product : BaseEntity
{
	public decimal SellPrice { get; set; }
	public decimal CostPrice { get; set; }
	public decimal DiscountedPrice { get; set; }
	public int AvgRating {get; set;}
	public int Quantity {get; set;}
	public string SKU { get; set; } = null!;
	public bool IsBestseller { get; set; }
    public bool IsNewArrival { get; set; }

    public string Title { get; set; } = null!;
	public string Description { get; set; } = null!;
	public string CoverImage { get; set; } = null!;

	public Guid SellerId { get; set; }

	public int? BrandId { get; set; }
	public Brand? Brand { get; set; }

	public int? CouponId { get; set; }
	public Coupon? Coupon { get; set; }

    public decimal Weight { get; set; }
    public decimal? Length { get; set; }
    public decimal? Width { get; set; }
    public decimal? Height { get; set; }

    //Category
	public int CategoryId { get; set; }
	public Category Category { get; set; } = null!;

	//OtherImages
	public IEnumerable<ProductImage> Images { get; set; } = null!;

	//Reviews
	public IEnumerable<Review>? Reviews { get; set; }

    //Rating
    public IEnumerable<ProductRating>? Ratings { get; set; }

    //Attributes
    public IEnumerable<ProductAttribute>? Attributes { get; set; }

	//Specification
	public IEnumerable<ProductSpecification>? Specifications { get; set; }
}

