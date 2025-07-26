using Capital.BL.Constants;
using Capital.BL.DTOs.CategoryDtos;
using Capital.BL.Exceptions.Common;
using Capital.BL.ExternalServices.Interfaces;
using Capital.BL.OtherServices.Interfaces;
using Capital.BL.Services.Interfaces;
using Capital.BL.Utilities.Enums;
using Capital.BL.Utilities.Helpers;
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
        var cacheKey = CacheKeys.AllCategories;
        var categories = await _cache.GetOrSetAsync(cacheKey, async () => await _repo.GetAllAsync(), TimeSpan.FromMinutes(2));

        var datas = _mapper.Map<IEnumerable<CategoryGetDto>>(categories);
        return datas; 
    }

    public async Task<CategoryGetDto> GetByIdAsync(int id)
    {
        var cacheKey = CacheKeys.CategoryById(id);
        var category = await _cache.GetOrSetAsync(cacheKey, async () => await _repo.GetByIdAsync(id), TimeSpan.FromMinutes(2));

        if (category == null)
            throw new NotFoundException<Category>();

        var data = _mapper.Map<CategoryGetDto>(category);

        return data; 
    }

    public async Task<CategoryGetDto> CreateAsync(CategoryCreateDto dto)
    {
        var data = _mapper.Map<Category>(dto);
        data.CreatedTime = DateTime.UtcNow;

        if(dto.ImageUrl != null)
            data.ImageUrl = await _fileService.ProcessImageAsync(dto.ImageUrl, "actors", "image/", 15);

        await _repo.AddAsync(data);
        await _repo.SaveAsync();

        await _cache.RemoveAsync(CacheKeys.AllCategories);
        var getDto = _mapper.Map<CategoryGetDto>(data); 
        return getDto;
    }

    public async Task<IEnumerable<CategoryGetDto>> CreateBulkAsync(IEnumerable<CategoryCreateDto> dtos)
    {
        var dataList = _mapper.Map<IList<Category>>(dtos);
        for (int i = 0; i < dataList.Count; i++)
        {
            dataList[i].CreatedTime = DateTime.UtcNow;

            if (dtos.ElementAt(i).ImageUrl != null)
                dataList[i].ImageUrl = await _fileService.ProcessImageAsync(dtos.ElementAt(i).ImageUrl, "actors", "image/", 15);
        }


        await _repo.AddRangeAsync(dataList);
        await _cache.RemoveAsync(CacheKeys.AllCategories);

        var getDtos = _mapper.Map<IEnumerable<CategoryGetDto>>(dataList);
        return getDtos; 
    }

    public async Task<CategoryGetDto> UpdateAsync(int id, CategoryUpdateDto dto)
    {
        var data = await _repo.GetByIdAsync(id, false) ?? throw new NotFoundException<Category>();
        var updatedDto = _mapper.Map(dto, data);

        if(data.ImageUrl != null)
            data.ImageUrl = await _fileService.ProcessImageAsync(dto.ImageUrl, "categories", "image/", 15, data.ImageUrl);

        updatedDto.UpdatedTime = DateTime.UtcNow;

        var getDto = _mapper.Map<CategoryGetDto>(data);

        return getDto; 
    }

    public async Task<bool> DeleteAsync(string ids, EDeleteType dType)
    {
        var idArray = FileHelper.ParseIds(ids);
        if (idArray.Length == 0)
            throw new ArgumentException("Hec bir id daxil edilmeyib!");

        if(dType == EDeleteType.Hard)
            foreach(var id in idArray)
            {
                var data = await _repo.GetByIdAsync(id, false);
                if (data != null && !string.IsNullOrEmpty(data.ImageUrl))
                    await _fileService.DeleteImageIfNotDefault(data.ImageUrl, "categories");
            }

        switch (dType)
        {
            case EDeleteType.Soft:
                await _repo.SoftDeleteRangeAsync(idArray);
                break;

            case EDeleteType.Reverse:
                await _repo.ReverseDeleteRangeAsync(idArray);
                break;

            case EDeleteType.Hard:
                await _repo.HardDeleteRangeAsync(idArray);
                break;

            default:
                throw new UnsupportedDeleteTypeException(); 
        }

        bool success = idArray.Length == await _repo.SaveAsync();

        if (success)
            foreach (var id in idArray)
                await _cache.RemoveAsync(CacheKeys.CategoryById(id));

        return success; 
    }
}

