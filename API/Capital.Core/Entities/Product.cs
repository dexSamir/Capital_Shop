using Capital.Core.Entities.Base;
using Capital.Core.Entities.Relational;

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
	public Guid BrandId { get; set; }

    public decimal Weight { get; set; }
    public decimal? Length { get; set; }
    public decimal? Width { get; set; }
    public decimal? Height { get; set; }

    //Category
    public IEnumerable<ProductCategory>? Categories { get; set; }

	//OtherImages
	public IEnumerable<ProductImage> Images { get; set; } = null!;

	//Reviews


	//Rating


}

