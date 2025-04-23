using Capital.Core.Entities.Base; 
using Capital.Core.Entities.Relational;

namespace Capital.Core.Entities;

public class Category : BaseEntity
{
	public string Title { get; set; } = null!;
	public string ImageUrl { get; set; } = null!;

	public IEnumerable<ProductCategory>? Products { get; set; }

}

