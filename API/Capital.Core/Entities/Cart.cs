using Capital.Core.Entities.Base;

namespace Capital.Core.Entities;

public class Cart : BaseEntity
{
    public string UserId { get; set; } = null!;
    public User User { get; set; } = null!;

    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}

