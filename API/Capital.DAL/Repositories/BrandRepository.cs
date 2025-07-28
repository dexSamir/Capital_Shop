using Capital.Core.Entities;
using Capital.Core.Repositories;
using Capital.DAL.Context;

namespace Capital.DAL.Repositories;

public class BrandRepository : GenericRepository<Brand>, IBrandRepository
{
	public BrandRepository(AppDbContext context) : base(context)
	{
	}
}

