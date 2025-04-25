using System.Linq.Expressions;
using Capital.Core.Entities.Base;
using Capital.Core.Repositories;
using Capital.DAL.Context;
using Microsoft.EntityFrameworkCore;

namespace Capital.DAL.Repositories; 

public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity, new() 
{
	readonly AppDbContext _context;
	protected DbSet<T> Table => _context.Set<T>();

	public GenericRepository(AppDbContext context)
	{
		_context = context; 
	}

    public Task<IEnumerable<T>> GetAllAsync(bool asNoTrack = true, params string[] includes)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<T>> GetAllAsync(params string[] includes)
    {
        Table
    }

    public Task<T?> GetByIdAsync(int id, bool asNoTrack = true, params string[] includes)
    {
        throw new NotImplementedException();
    }

    public Task<T?> GetByIdAsync(int id, params string[] includes)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<T>> GetByIdAsync(int[] ids, bool asNoTrack = true, params string[] includes)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<T>> GetWhereAsync(Expression<Func<T, bool>> expression, bool asNoTrack = true, params string[] includes)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<T>> GetWhereAsync(Expression<Func<T, bool>> expression, params string[] includes)
    {
        throw new NotImplementedException();
    }

    public Task<T?> GetFirstAsync(Expression<Func<T, bool>> expression, bool asNoTrack = true, params string[] includes)
    {
        throw new NotImplementedException();
    }

    public Task<T?> GetFirstAsync(Expression<Func<T, bool>> expression, params string[] includes)
    {
        throw new NotImplementedException();
    }

    public Task<bool> IsExistAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> IsExistAsync(Expression<Func<T, bool>> expression)
    {
        throw new NotImplementedException();
    }

    public Task AddAsync(T entity)
    {
        throw new NotImplementedException();
    }

    public Task AddRangeAsync(IEnumerable<T> entities)
    {
        throw new NotImplementedException();
    }

    public Task HardDeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task SoftDeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task ReverseDeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task HardDeleteRangeAsync(int[] ids)
    {
        throw new NotImplementedException();
    }

    public Task SoftDeleteRangeAsync(int[] ids)
    {
        throw new NotImplementedException();
    }

    public Task ReverseDeleteRangeAsync(int[] ids)
    {
        throw new NotImplementedException();
    }

    public void HardDelete(T entity)
    {
        throw new NotImplementedException();
    }

    public void SoftDelete(T entity)
    {
        throw new NotImplementedException();
    }

    public void ReverseDelete(T entity)
    {
        throw new NotImplementedException();
    }

    public void HardDeleteRange(IEnumerable<T> entites)
    {
        throw new NotImplementedException();
    }

    public void SoftDeleteRange(IEnumerable<T> entites)
    {
        throw new NotImplementedException();
    }

    public void ReverseDeleteRange(IEnumerable<T> entites)
    {
        throw new NotImplementedException();
    }
    
    public Task DeleteAndSaveAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<int> SaveAsync()
    {
        throw new NotImplementedException();
    }

    IQueryable<T>  _includeAndTracking(IQueryable<T> query, string[] includes, bool asNoTrack)
    {
        if (includes is not null && includes.Length > 0)
        {
            query = _checkIncludes(query, includes);
            if (asNoTrack)
                query.AsNoTrackingWithIdentityResolution();
        }
        else
            if (asNoTrack)
            query.AsNoTracking();

        return query; 
    }

    IQueryable<T> _checkIncludes (IQueryable<T> query, string[] includes)
    {
        foreach (var include in includes)
            query = query.Include(include);
        return query; 
    }
}

