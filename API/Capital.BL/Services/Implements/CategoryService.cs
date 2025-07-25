using AutoMapper;
using Capital.BL.DTOs.CategoryDtos;
using Capital.BL.Exceptions.Common;
using Capital.BL.ExternalServices.Interfaces;
using Capital.BL.OtherServices.Interfaces;
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
        var cacheKey = "all_categories";
        var categories = await _cache.GetOrSetAsync(cacheKey, async () => await _repo.GetAllAsync(), TimeSpan.FromMinutes(2));

        var datas = _mapper.Map<IEnumerable<CategoryGetDto>>(categories);
        return datas; 
    }

    public async Task<CategoryGetDto> GetByIdAsync(Guid id)
    {
        var cacheKey = $"category_{id}";
        var category = _cache.GetOrSetAsync(cacheKey, async () => await _repo.GetByIdAsync(id), TimeSpan.FromMinutes(2));

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

        await _cache.RemoveAsync($"all_categories");
        var getDto = _mapper.Map<CategoryGetDto>(data); 
        return getDto;
    }

    public async Task<IEnumerable<CategoryGetDto>> CreateBulkAsync(IEnumerable<CategoryCreateDto> dtos)
    {
        var datas = _mapper.Map<IEnumerable<Category>>(dtos);
        foreach (var data in datas)
        {
            data.CreatedTime = DateTime.UtcNow;

            foreach (var dto in dtos)
                if (dto.ImageUrl != null)
                    data.ImageUrl = await _fileService.ProcessImageAsync(dto.ImageUrl, "actors", "image/", 15);
        }

        await _repo.AddRangeAsync(datas);
        await _cache.RemoveAsync("all_categories");

        var getDtos = _mapper.Map<IEnumerable<CategoryGetDto>>(datas);
        return getDtos; 
    }

    public async Task<CategoryGetDto> UpdateAsync(Guid id, CategoryUpdateDto dto)
    {
        var data = await _repo.GetByIdAsync(id, false) ?? throw new NotFoundException<Category>();
        var updatedDto = _mapper.Map(dto, data);

        if(data.ImageUrl != null)
            data.ImageUrl = await _fileService.ProcessImageAsync(dto.ImageUrl, "categories", "image/", 15, data.ImageUrl);

        updatedDto.UpdatedTime = DateTime.UtcNow;

        var getDto = _mapper.Map<CategoryGetDto>(data);

        return getDto; 
    }

    public Task<bool> DeleteAsync(IEnumerable<Guid> ids, EDeleteType dType)
    {
        throw new ArgumentNullException(); 
    }
}

