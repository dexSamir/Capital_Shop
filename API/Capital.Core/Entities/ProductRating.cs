using Capital.Core.Entities.Base;

namespace Capital.Core.Entities;
public class ProductRating : BaseEntity
{
	public int Rating { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string UserId { get; set; } = null!;
    public User User { get; set; } = null!;
}

