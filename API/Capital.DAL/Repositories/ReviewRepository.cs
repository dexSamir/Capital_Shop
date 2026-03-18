using Capital.Core.Entities;
using Capital.Core.Repositories;
using Capital.DAL.Context;

namespace Capital.DAL.Repositories;

public class ReviewRepository : GenericRepository<Review>, IReviewRepository
{
    public ReviewRepository(AppDbContext context) : base(context)
    {
    }
}
