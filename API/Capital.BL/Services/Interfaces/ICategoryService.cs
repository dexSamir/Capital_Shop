using Capital.BL.DTOs.CategoryDtos;
using Capital.BL.Utilities.Enums;

namespace Capital.BL.Services.Interfaces;
public interface ICategoryService
{
    Task<CategoryGetDto> GetByIdAsync(Guid id);
    Task<IEnumerable<CategoryGetDto>> GetAllAsync();

    Task<CategoryGetDto> CreateAsync(CategoryCreateDto dto);
    Task<IEnumerable<CategoryGetDto>> CreateBulkAsync(IEnumerable<CategoryCreateDto> dtos);

    Task<CategoryGetDto> UpdateAsync(CategoryUpdateDto dto);
    Task<bool> DeleteAsync(IEnumerable<Guid> ids, EDeleteType dType);
}

