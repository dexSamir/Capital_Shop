using Capital.Core.Entities.Base;

namespace Capital.Core.Entities;

public class Review : BaseEntity
{
	public string Comment { get; set; } = null!;
	public bool IsAproved { get; set; }

	public IEnumerable<ProductImage>? Images { get; set; }

	public int ProductId { get; set; }
	public Product Product { get; set; } = null!;

    public int? RatingId { get; set; }
    public ProductRating? Rating { get; set; }

    //Customer

}

