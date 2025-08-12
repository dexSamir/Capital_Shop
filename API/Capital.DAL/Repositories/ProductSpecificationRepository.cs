using Capital.Core.Entities;
using Capital.Core.Repositories;
using Capital.DAL.Context;

namespace Capital.DAL.Repositories;

public class ProductSpecificationRepository : GenericRepository<ProductSpecification>, IProductSpecificationRepository
{
	public ProductSpecificationRepository(AppDbContext context) : base(context)
	{
	}
}

