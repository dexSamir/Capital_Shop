using Capital.Core.Entities.Base;

namespace Capital.Core.Entities;
public class ProductAttribute : BaseEntity
{
	public string Name { get; set; } = null!;
	public string Value { get; set; } = null!;

	public int ProductId { get; set; }
	public Product Product { get; set; } = null!;
}

