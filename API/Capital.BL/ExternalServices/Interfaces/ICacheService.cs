namespace Capital.BL.ExternalServices.Interfaces;
public interface ICacheService
{
    Task<T> GetOrSetAsync<T>(string cacheKey, Func<Task<T>> getData, TimeSpan expiration);
    Task RemoveAsync(string cacheKey); 
}

