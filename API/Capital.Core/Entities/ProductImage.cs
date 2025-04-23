using Capital.Core.Entities.Base;

namespace Capital.Core.Entities;

public class ProductImage : BaseEntity
{
	public string? ImageUrl {get; set;}
	public bool IsPrimary { get; set; }

	public Guid ProductId { get; set; }
	public Product Product { get; set; } = null!; 
}

