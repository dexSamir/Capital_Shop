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

    public async Task<T?> GetByIdAsync(int id, bool asNoTrack = true, params string[] includes)
        => await _includeAndTracking(Table, includes, asNoTrack).FirstOrDefaultAsync(x => x.Id == id);

    public async Task<T?> GetByIdAsync(int id, params string[] includes)
        => await GetByIdAsync(id, true, includes);

    public async Task<IEnumerable<T>> GetByIdAsync(int[] ids, bool asNoTrack = true, params string[] includes)
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

    public async Task<bool> IsExistAsync(int id)
        => await Table.AnyAsync(x => x.Id == id);

    public async Task<bool> IsExistAsync(Expression<Func<T, bool>> expression)
        => await Table.AnyAsync(expression);

    //Pagination
    public async Task<IEnumerable<T>> GetPagedAsync(Expression<Func<T, bool>> expression, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy, int page = 1, int pageSize = 30, bool asNoTrack = true, params string[] includes)
    {
        IQueryable<T> query = Table;

        if (expression != null)
            query = query.Where(expression);

        query = _includeAndTracking(query, includes, asNoTrack);

        if (orderBy != null)
            query = orderBy(query);

        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return items;
    }

    public async Task AddAsync(T entity)
        => await Table.AddAsync(entity);

    public async Task AddRangeAsync(IEnumerable<T> entities)
        => await Table.AddRangeAsync(entities);

    public void UpdateAsync(T entity)
       => Table.Update(entity);

    public async Task HardDeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id, false);
        Table.Remove(entity!);
    }

    public async Task SoftDeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id, false);
        entity!.isDeleted = true;
    }

    public async Task ReverseDeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id, false);
        entity!.isDeleted = false;
    }

    public async Task HardDeleteRangeAsync(int[] ids)
    {
        var entites = await Table.Where(x => ids.Contains(x.Id)).ToListAsync();
        if (entites.Any()) Table.RemoveRange(entites);
    }

    public async Task SoftDeleteRangeAsync(int[] ids)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        await Table.Where(x => ids.Contains(x.Id))
                   .ExecuteUpdateAsync(s => s.SetProperty(x => x.isDeleted, true));
        await transaction.CommitAsync();
    }

    public async Task ReverseDeleteRangeAsync(int[] ids)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        await Table.Where(x => ids.Contains(x.Id))
                   .ExecuteUpdateAsync(s => s.SetProperty(x => x.isDeleted, false));
        await transaction.CommitAsync();
    }

    public void HardDelete(T entity)
    {
        Table.Remove(entity);
    }

    public void SoftDelete(T entity)
    {
        entity.isDeleted = true;
    }

    public void ReverseDelete(T entity)
    {
        entity.isDeleted = false;
    }

    public void HardDeleteRange(IEnumerable<T> entities)
    {
        Table.RemoveRange(entities);
    }

    public void SoftDeleteRange(IEnumerable<T> entities)
    {
        var ids = entities.Select(e => e.Id).ToArray();
        Table.Where(x => ids.Contains(x.Id))
             .ExecuteUpdate(s => s.SetProperty(x => x.isDeleted, true));
    }

    public void ReverseDeleteRange(IEnumerable<T> entities)
    {
        var ids = entities.Select(e => e.Id).ToArray();
        Table.Where(x => ids.Contains(x.Id))
             .ExecuteUpdate(s => s.SetProperty(x => x.isDeleted, false));
    }

    public async Task<int> DeleteAndSaveAsync(int id)
    {
        return await Table.Where(x => x.Id == id).ExecuteDeleteAsync();
    }

    public async Task<int> SaveAsync()
        => await _context.SaveChangesAsync();


    IQueryable<T> _includeAndTracking(IQueryable<T> query, string[] includes, bool asNoTrack)
    {
        if (includes is not null && includes.Length > 0)
        {
            query = _checkIncludes(query, includes);
            if (asNoTrack)
                query = query.AsNoTrackingWithIdentityResolution();
        }
        else
            if (asNoTrack)
            query = query.AsNoTracking();

        return query;
    }

    IQueryable<T> _checkIncludes(IQueryable<T> query, string[] includes)
    {
        foreach (var include in includes)
            query = query.Include(include);
        return query;
    }
}

