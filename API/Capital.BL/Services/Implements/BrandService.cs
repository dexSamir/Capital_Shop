using Capital.BL.Constants;
using Capital.BL.DTOs.BrandDtos;
using Capital.BL.Exceptions.Common;
using Capital.BL.ExternalServices.Interfaces;
using Capital.BL.OtherServices.Interfaces;
using Capital.BL.Services.Interfaces;
using Capital.BL.Utilities.Enums;
using Capital.Core.Entities;
using Capital.Core.Repositories;

namespace Capital.BL.Services.Implements;

public class BrandService : IBrandService
{
    readonly IBrandRepository _repo;
    readonly ICacheService _cache;
    readonly IFileService _fileService;
    readonly IMapper _mapper; 
    public BrandService(IBrandRepository repo, ICacheService cache, IFileService fileService, IMapper mapper)
    {
        _repo = repo;
        _cache = cache;
        _fileService = fileService;
        _mapper = mapper; 
    }

    public async Task<IEnumerable<BrandGetDto>> GetAllAsync()
    {
        var brands = await _cache.GetOrSetAsync(CacheKeys.Brand.All, async () => await _repo.GetAllAsync(), TimeSpan.FromMinutes(2));

        return _mapper.Map<IEnumerable<BrandGetDto>>(brands); 
    }

    public async Task<BrandGetDto> GetByIdAsync(int id)
    {
        if (!await _repo.IsExistAsync(id))
            throw new NotFoundException<Brand>();

        var brand = await _cache.GetOrSetAsync(CacheKeys.Brand.ById(id), async () => await _repo.GetByIdAsync(id, false), TimeSpan.FromMinutes(2));

        return _mapper.Map<BrandGetDto>(brand); 
    }

    public async Task<BrandGetDto> CreateAsync(BrandCreateDto dto)
    {
        var data = _mapper.Map<Brand>(dto);
        data.CreatedTime = DateTime.UtcNow;

        if (dto.LogoUrl != null)
            data.LogoUrl = await _fileService.ProcessImageAsync(dto.LogoUrl, "brands", "image/", 15);

        await _repo.AddAsync(data);
        await _repo.SaveAsync();
        await _cache.RemoveAsync(CacheKeys.Brand.All);

        return _mapper.Map<BrandGetDto>(data); 
    }

    public async Task<IEnumerable<BrandGetDto>> CreateBulkAsync(IEnumerable<BrandCreateDto> dtos)
    {
        var datas = _mapper.Map<IList<Brand>>(dtos);

        for(int i = 0; i < datas.Count; i++)
        {
            datas[i].CreatedTime = DateTime.UtcNow;

            if (dtos.ElementAt(i).LogoUrl != null)
                datas[i].LogoUrl = await _fileService.ProcessImageAsync(dtos.ElementAt(i).LogoUrl, "brands", "image/", 15);
        }

        await _repo.AddRangeAsync(datas);
        await _cache.RemoveAsync(CacheKeys.Brand.All);

        return _mapper.Map<IEnumerable<BrandGetDto>>(datas);
    }

    public async Task<BrandGetDto> UpdateAsync(int id, BrandUpdateDto dto)
    {
        var data =await _repo.GetByIdAsync(id, false) ?? throw new NotFoundException<Brand>();
        _mapper.Map(dto, data);

        if(dto.LogoUrl != null)
            data.LogoUrl = await _fileService.ProcessImageAsync(dto.LogoUrl, "brands", "image/", 15, data.LogoUrl);

        data.UpdatedTime = DateTime.UtcNow;
        data.isUpdated = true; 

        await _cache.RemoveAsync(CacheKeys.Brand.ById(id));
        _repo.UpdateAsync(data);
        await _repo.SaveAsync();

        return _mapper.Map<BrandGetDto>(data); 
    }

    public async Task<bool> DeleteAsync(int[] ids, EDeleteType dType)
    {
        if (ids.Length == 0)
            throw new ArgumentException("Hec bir id daxil edilmeyib!");

        if(dType == EDeleteType.Hard)
            foreach (var id in ids)
            {
                var data = await _repo.GetByIdAsync(id, false) ?? throw new NotFoundException<Brand>();
                if(!string.IsNullOrEmpty(data.LogoUrl))
                    await _fileService.DeleteImageIfNotDefault(data.LogoUrl, "brands");
            }

        switch (dType)
        {
            case EDeleteType.Soft:
                await _repo.SoftDeleteRangeAsync(ids);
                break;

            case EDeleteType.Reverse:
                await _repo.ReverseDeleteRangeAsync(ids);
                break;

            case EDeleteType.Hard:
                await _repo.HardDeleteRangeAsync(ids);
                break;

            default:
                throw new UnsupportedDeleteTypeException($"Delete type '{dType}' is not supported.");
        }

        bool success = await _repo.SaveAsync() >= 0;

        if (success)
            foreach (var id in ids)
                await _cache.RemoveAsync(CacheKeys.Brand.ById(id));

        return success;
    }

}

