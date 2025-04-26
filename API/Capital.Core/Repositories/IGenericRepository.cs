using System.Linq.Expressions;
using Capital.Core.Entities.Base;

namespace Capital.Core.Repositories;

public interface IGenericRepository<T> where T : BaseEntity, new() 
{
    Task<IEnumerable<T>> GetAllAsync(bool asNoTrack = true, params string[] includes);
    Task<IEnumerable<T>> GetAllAsync(params string[] includes);

    Task<T?> GetByIdAsync(Guid id, bool asNoTrack = true, params string[] includes);
    Task<T?> GetByIdAsync(Guid id, params string[] includes);
    Task<IEnumerable<T>> GetByIdAsync(int[] ids, bool asNoTrack = true, params string[] includes);

    Task<IEnumerable<T>> GetWhereAsync(Expression<Func<T, bool>> expression, bool asNoTrack = true, params string[] includes);
    Task<IEnumerable<T>> GetWhereAsync(Expression<Func<T, bool>> expression, params string[] includes);

    Task<T?> GetFirstAsync(Expression<Func<T, bool>> expression, bool asNoTrack = true, params string[] includes);
    Task<T?> GetFirstAsync(Expression<Func<T, bool>> expression, params string[] includes);

    Task<bool> IsExistAsync(int id);
    Task<bool> IsExistAsync(Expression<Func<T, bool>> expression);

    //Create
    Task AddAsync(T entity);
    Task AddRangeAsync(IEnumerable<T> entities);

    //Delete
    Task HardDeleteAsync(int id);
    Task SoftDeleteAsync(int id);
    Task ReverseDeleteAsync(int id);

    //Delete Range 
    Task HardDeleteRangeAsync(int[] ids);
    Task SoftDeleteRangeAsync(int[] ids);
    Task ReverseDeleteRangeAsync(int[] ids);

    //Delete 
    void HardDelete(T entity);
    void SoftDelete(T entity);
    void ReverseDelete(T entity);

    //Delete Range 
    void HardDeleteRange(IEnumerable<T> entites);
    void SoftDeleteRange(IEnumerable<T> entites);
    void ReverseDeleteRange(IEnumerable<T> entites);

    Task DeleteAndSaveAsync(int id);
    Task<int> SaveAsync();
}

