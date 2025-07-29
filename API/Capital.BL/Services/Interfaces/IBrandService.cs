using Capital.BL.DTOs.BrandDtos;
using Capital.BL.Utilities.Enums;

namespace Capital.BL.Services.Interfaces;

public interface IBrandService
{
    Task<IEnumerable<BrandGetDto>> GetAllAsync();
    Task<BrandGetDto> GetByIdAsync(int id);

    Task<BrandGetDto> CreateAsync(BrandCreateDto dto);
    Task<IEnumerable<BrandGetDto>> CreateBulkAysnc(IEnumerable<BrandCreateDto> dtos);

    Task<BrandGetDto> UpdateAsync(int id, BrandUpdateDto dto);
    Task<bool> DeleteAsync(int[] ids, EDeleteType dType); 
}

