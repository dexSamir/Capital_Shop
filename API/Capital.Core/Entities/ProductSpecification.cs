using Capital.Core.Entities.Base;

namespace Capital.Core.Entities; 
public class ProductSpecification : BaseEntity
{
	public string Key { get; set; } = null!;
	public string Value { get; set; } = null!;

	public int ProductId { get; set; }
	public Product Product { get; set; } = null!; 
}

