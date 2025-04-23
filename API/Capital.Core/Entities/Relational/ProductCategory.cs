namespace Capital.Core.Entities.Relational;

public class ProductCategory
{
	public int Id { get; set; }
	public Guid ProductId { get; set; }
	public Product Product { get; set; }

	public Guid CategoryId { get; set; }
	public Category Category { get; set; }
}

