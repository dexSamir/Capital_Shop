using Capital.Core.Entities.Base;

namespace Capital.Core.Entities;

public class Product : BaseEntity
{
	public decimal SellPrice { get; set; }
	public decimal CostPrice { get; set; }
	public int Quantity {get; set;}
	public string Title { get; set; } = null!;
	public string Description { get; set; } = null!;
	public string CoverImage { get; set; } = null!;

	//Category

	//OtherImages

	//Reviews



}

