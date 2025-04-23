using Capital.Core.Entities.Base; 

namespace Capital.Core.Entities;

public class Category : BaseEntity
{
	public string Title { get; set; } = null!;
	public string ImageUrl { get; set; } = null!;

	public IEnumerable<Product>? Products { get; set; }

}

