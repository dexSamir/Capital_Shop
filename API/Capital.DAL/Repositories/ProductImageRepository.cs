using Capital.Core.Entities;
using Capital.Core.Repositories;
using Capital.DAL.Context;

namespace Capital.DAL.Repositories;

public class ProductImageRepository : GenericRepository<ProductImage> , IProductImageRepository
{
	public ProductImageRepository(AppDbContext context) : base(context)
	{
	}
}

