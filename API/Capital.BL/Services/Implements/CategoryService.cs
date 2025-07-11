using AutoMapper;
using Capital.BL.DTOs.CategoryDtos;
using Capital.BL.Services.Interfaces;
using Capital.BL.Utilities.Enums;
using Capital.Core.Repositories;

namespace Capital.BL.Services.Implements;
public class CategoryService : ICategoryService
{
    readonly ICategoryRepository _repo;
    readonly IMapper _mapper;
    public CategoryService(ICategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper; 
    }

    public async Task<CategoryGetDto> CreateAsync(CategoryCreateDto dto)
    {
        
    }

    public Task<IEnumerable<CategoryGetDto>> CreateBulkAsync(IEnumerable<CategoryCreateDto> dtos)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteAsync(IEnumerable<Guid> ids, EDeleteType dType)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<CategoryGetDto>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<CategoryGetDto> GetByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<CategoryGetDto> UpdateAsync(CategoryUpdateDto dto)
    {
        throw new NotImplementedException();
    }
}

