using System.Linq.Expressions;
using Capital.Core.Entities.Base;

namespace Capital.Core.Repositories;

public interface IGenericRepository<T> where T : BaseEntity, new() 
{
    Task<IEnumerable<T>> GetAllAsync(bool asNoTrack = true, params string[] includes);
    Task<IEnumerable<T>> GetAllAsync(params string[] includes);

    Task<T?> GetByIdAsync(Guid id, bool asNoTrack = true, params string[] includes);
    Task<T?> GetByIdAsync(Guid id, params string[] includes);
    Task<IEnumerable<T>> GetByIdAsync(Guid[] ids, bool asNoTrack = true, params string[] includes);

    Task<IEnumerable<T>> GetWhereAsync(Expression<Func<T, bool>> expression, bool asNoTrack = true, params string[] includes);
    Task<IEnumerable<T>> GetWhereAsync(Expression<Func<T, bool>> expression, params string[] includes);

    Task<T?> GetFirstAsync(Expression<Func<T, bool>> expression, bool asNoTrack = true, params string[] includes);
    Task<T?> GetFirstAsync(Expression<Func<T, bool>> expression, params string[] includes);

    Task<bool> IsExistAsync(Guid id);
    Task<bool> IsExistAsync(Expression<Func<T, bool>> expression);

    //Create
    Task AddAsync(T entity);
    Task AddRangeAsync(IEnumerable<T> entities);

    //Delete
    Task HardDeleteAsync(Guid id);
    Task SoftDeleteAsync(Guid id);
    Task ReverseDeleteAsync(Guid id);

    //Delete Range 
    Task HardDeleteRangeAsync(Guid[] ids);
    Task SoftDeleteRangeAsync(Guid[] ids);
    Task ReverseDeleteRangeAsync(Guid[] ids);

    //Delete 
    void HardDelete(T entity);
    void SoftDelete(T entity);
    void ReverseDelete(T entity);

    //Delete Range 
    void HardDeleteRange(IEnumerable<T> entities);
    void SoftDeleteRange(IEnumerable<T> entities);
    void ReverseDeleteRange(IEnumerable<T> entities);

    Task DeleteAndSaveAsync(Guid id);
    Task<int> SaveAsync();
}

