using Capital.Core.Entities;
using Capital.Core.Repositories;
using Capital.DAL.Context;

namespace Capital.DAL.Repositories;

public class ProductRepository : GenericRepository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context)
    {

    }
}

