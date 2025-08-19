using System.Text.Json;
using Capital.BL.ExternalServices.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace Capital.BL.ExternalServices.Implements;

public class CacheService(IDistributedCache cache) : ICacheService
{
    public async Task<T> GetOrSetAsync<T>(string cacheKey, Func<Task<T>> getData, TimeSpan expiration)
    {
        var cachedData = await cache.GetStringAsync(cacheKey);

        if (!string.IsNullOrWhiteSpace(cachedData))
            return JsonSerializer.Deserialize<T>(cachedData);

        var data = await getData();
        if (data != null)
        {
            await cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(data), new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration
            });
        }
        return data; 
    }

    public async Task RemoveAsync(string cacheKey)
    {
        await cache.RemoveAsync(cacheKey); 
    }
}

