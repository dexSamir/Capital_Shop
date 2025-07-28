using Capital.BL.Constants;
using Capital.BL.DTOs.BrandDtos;
using Capital.BL.ExternalServices.Interfaces;
using Capital.BL.OtherServices.Interfaces;
using Capital.BL.Services.Interfaces;
using Capital.BL.Utilities.Enums;
using Capital.Core.Repositories;

namespace Capital.BL.Services.Implements;

public class BrandService : IBrandService
{
    readonly IBrandRepository _repo;
    readonly ICacheService _cache;
    readonly IFileService _file;
    readonly IMapper _mapper; 
    public BrandService(IBrandRepository repo, ICacheService cache, IFileService file, IMapper mapper)
    {
        _repo = repo;
        _cache = cache;
        _file = file;
        _mapper = mapper; 
    }

    public async Task<IEnumerable<BrandGetDto>> GetAllAsync()
    {
        string cacheKey = CacheKeys.AllBrands;
        var brands = await _cache.GetOrSetAsync(cacheKey, async () => await _repo.GetAllAsync(), TimeSpan.FromMinutes(2));

        return _mapper.Map<IEnumerable<BrandGetDto>>(brands); 
    }

    public Task<BrandGetDto> GetByIdAsync()
    {
        throw new NotImplementedException();
    }

    public Task<BrandGetDto> CreateAsync(BrandCreateDto dto)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<BrandGetDto>> CreateBulkAysnc(IEnumerable<BrandCreateDto> dtos)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteAsync(int[] ids, EDeleteType dType)
    {
        throw new NotImplementedException();
    }

    public Task<BrandGetDto> UpdateAsync(int id, BrandUpdateDto dto)
    {
        throw new NotImplementedException();
    }
}

