using Capital.Core.Entities.Base;

namespace Capital.Core.Entities; 
public class Brand : BaseEntity
{
	public string Title { get; set; } = null!;
	public string? LogoUrl { get; set; }
    public string? Website { get; set; }

    public ICollection<Product>? Products { get; set; }
}

