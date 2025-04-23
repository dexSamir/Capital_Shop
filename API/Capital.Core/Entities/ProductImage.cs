using Capital.Core.Entities.Base;

namespace Capital.Core.Entities;

public class ProductImage : BaseEntity
{
	public string? ImageUrl {get; set;}
	public bool IsPrimary { get; set; }
    public string? AltText { get; set; }

    public Guid ProductId { get; set; }
	public Product Product { get; set; } = null!;

	public Guid? ReviewId { get; set; }
	public Review? Review { get; set; }
}

