using Capital.Core.Entities.Relational;
using Capital.Core.Repositories;
using Capital.DAL.Context;

namespace Capital.DAL.Repositories;

public class ProductAttributeValueRepository : GenericRepository<ProductAttributeValue> , IProductAttributeValueRepository
{
	public ProductAttributeValueRepository(AppDbContext context) : base(context)
	{
	}
}

