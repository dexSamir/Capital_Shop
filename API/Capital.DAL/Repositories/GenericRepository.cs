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

    public async Task<IEnumerable<T>> GetAllAsync(bool asNoTrack = true, params string[] includes)
        => await _includeAndTracking(Table, includes, asNoTrack).ToListAsync();

    public async Task<IEnumerable<T>> GetAllAsync(params string[] includes)
        => await GetAllAsync(true, includes);

    public async Task<T?> GetByIdAsync(Guid id, bool asNoTrack = true, params string[] includes)
        => await _includeAndTracking(Table, includes, asNoTrack).FirstOrDefaultAsync(x=> x.Id == id);

    public async Task<T?> GetByIdAsync(Guid id, params string[] includes)
        => await GetByIdAsync(id, true, includes);

    public async Task<IEnumerable<T>> GetByIdAsync(Guid[] ids, bool asNoTrack = true, params string[] includes)
    {
        var query = Table.Where(l => ids.Contains(l.Id));
        query = _includeAndTracking(Table, includes, asNoTrack);
        return await query.ToListAsync(); 
    }

    public async Task<IEnumerable<T>> GetWhereAsync(Expression<Func<T, bool>> expression, bool asNoTrack = true, params string[] includes)
        => await _includeAndTracking(Table.Where(expression), includes, asNoTrack).ToListAsync();

    public async Task<IEnumerable<T>> GetWhereAsync(Expression<Func<T, bool>> expression, params string[] includes)
        => await GetWhereAsync(expression, true, includes);

    public async Task<T?> GetFirstAsync(Expression<Func<T, bool>> expression, bool asNoTrack = true, params string[] includes)
        => await _includeAndTracking(Table.Where(expression), includes, asNoTrack).FirstOrDefaultAsync();

    public async Task<T?> GetFirstAsync(Expression<Func<T, bool>> expression, params string[] includes)
        => await GetFirstAsync(expression, true, includes);

    public async Task<bool> IsExistAsync(Guid id)
        => await Table.AnyAsync(x => x.Id == id);

    public async Task<bool> IsExistAsync(Expression<Func<T, bool>> expression)
        => await Table.AnyAsync(expression);

    public async Task AddAsync(T entity)
        =>await Table.AddAsync(entity);

    public async Task AddRangeAsync(IEnumerable<T> entities)
       =>  await Table.AddRangeAsync(entities);

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

