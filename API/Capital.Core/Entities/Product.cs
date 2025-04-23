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

	public string Title { get; set; } = null!;
	public string Description { get; set; } = null!;
	public string CoverImage { get; set; } = null!;

	public Guid SellerId { get; set; }
	public Guid BrandId { get; set; }

	public double Wheight { get; set; }

	//Category
	public IEnumerable<ProductCategory>? Categories { get; set; } 

	//OtherImages
	

	//Reviews

	//Rating


}

