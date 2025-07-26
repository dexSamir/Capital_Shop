using Capital.Core.Entities.Base;

namespace Capital.Core.Entities;

public class ProductImage : BaseEntity
{
	public string? ImageUrl {get; set;}
	public bool IsPrimary { get; set; }
    public string? AltText { get; set; }

    public int ProductId { get; set; }
	public Product Product { get; set; } = null!;

	public int? ReviewId { get; set; }
	public Review? Review { get; set; }
}

