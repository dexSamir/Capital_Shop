using Capital.BL.DTOs.ReviewDtos;

namespace Capital.BL.Services.Interfaces;

public interface IReviewService
{
    Task<IEnumerable<ReviewGetDto>> GetByProductIdAsync(int productId);
    Task<ReviewGetDto> CreateAsync(ReviewCreateDto dto, string userId);
}
