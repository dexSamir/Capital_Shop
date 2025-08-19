using Capital.BL.Constants;
using Capital.BL.DTOs.CategoryDtos;
using Capital.BL.Exceptions.Common;
using Capital.BL.ExternalServices.Interfaces;
using Capital.BL.Services.Interfaces;
using Capital.BL.Utilities.Enums;
using Capital.Core.Entities;
using Capital.Core.Repositories;
namespace Capital.BL.Services.Implements;

public class CategoryService : ICategoryService
{
    readonly ICategoryRepository _repo;
    readonly ICacheService _cache; 
    readonly IMapper _mapper;
    readonly IFileService _fileService;
    public CategoryService(ICategoryRepository repo, IMapper mapper, ICacheService cache, IFileService fileService)
    {
        _repo = repo;
        _cache = cache; 
        _mapper = mapper;
        _fileService = fileService; 
    }

    public async Task<IEnumerable<CategoryGetDto>> GetAllAsync()
    {
        var categories = await _cache.GetOrSetAsync(CacheKeys.Category.All, async () => await _repo.GetAllAsync(), TimeSpan.FromMinutes(2));
        
        return _mapper.Map<IEnumerable<CategoryGetDto>>(categories); 
    }

    public async Task<CategoryGetDto> GetByIdAsync(int id)
    {
        if (!await _repo.IsExistAsync(id))
            throw new NotFoundException<Brand>();

        var category = await _cache.GetOrSetAsync(CacheKeys.Category.ById(id), async () => await _repo.GetByIdAsync(id), TimeSpan.FromMinutes(2));

        return _mapper.Map<CategoryGetDto>(category); 
    }

    public async Task<CategoryGetDto> CreateAsync(CategoryCreateDto dto)
    {
        var data = _mapper.Map<Category>(dto);
        data.CreatedTime = DateTime.UtcNow;

        if(dto.ImageUrl != null)
            data.ImageUrl = await _fileService.ProcessImageAsync(dto.ImageUrl, "categories", "image/", 15);

        await _repo.AddAsync(data);
        await _repo.SaveAsync();

        await _cache.RemoveAsync(CacheKeys.Category.All);
        return _mapper.Map<CategoryGetDto>(data); ;
    }

    public async Task<IEnumerable<CategoryGetDto>> CreateBulkAsync(IEnumerable<CategoryCreateDto> dtos)
    {
        var dataList = _mapper.Map<IList<Category>>(dtos);
        for (int i = 0; i < dataList.Count; i++)
        {
            dataList[i].CreatedTime = DateTime.UtcNow;

            if (dtos.ElementAt(i).ImageUrl != null)
                dataList[i].ImageUrl = await _fileService.ProcessImageAsync(dtos.ElementAt(i).ImageUrl, "categories", "image/", 15);
        }


        await _repo.AddRangeAsync(dataList);
        await _cache.RemoveAsync(CacheKeys.Category.All);

        return _mapper.Map<IEnumerable<CategoryGetDto>>(dataList); 
    }

    public async Task<CategoryGetDto> UpdateAsync(int id, CategoryUpdateDto dto)
    {
        var data = await _repo.GetByIdAsync(id, false) ?? throw new NotFoundException<Category>();

        _mapper.Map(dto, data); // Yalnız Title gəlir bu mapper-dən

        if (dto.ImageUrl != null)
        {
            data.ImageUrl = await _fileService.ProcessImageAsync(
                dto.ImageUrl, "categories", "image/", 15, data.ImageUrl);
        }

        data.UpdatedTime = DateTime.UtcNow;

        _repo.UpdateAsync(data);
        await _repo.SaveAsync();
        await _cache.RemoveAsync(CacheKeys.Category.ById(id)); 

        return _mapper.Map<CategoryGetDto>(data);
    }

    public async Task<bool> DeleteAsync(int[] ids, EDeleteType dType)
    {
        if (ids.Length == 0)
            throw new ArgumentException("Hec bir id daxil edilmeyib!");

        if(dType == EDeleteType.Hard)
            foreach(var id in ids)
            {
                var data = await _repo.GetByIdAsync(id, false) ?? throw new NotFoundException<Category>();
                if (!string.IsNullOrEmpty(data.ImageUrl))
                    await _fileService.DeleteImageIfNotDefault(data.ImageUrl, "categories");
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
                await _cache.RemoveAsync(CacheKeys.Category.ById(id));

        return success; 
    }
}

