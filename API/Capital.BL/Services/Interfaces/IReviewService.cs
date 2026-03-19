using Capital.BL.DTOs.ReviewDtos;

namespace Capital.BL.Services.Interfaces;

public interface IReviewService
{
    Task<IEnumerable<ReviewGetDto>> GetByProductIdAsync(int productId, string? userId = null);
    Task<ReviewGetDto> CreateAsync(ReviewCreateDto dto, string userId);
    Task LikeAsync(int id, string userId);
    Task DislikeAsync(int id, string userId);
    Task DeleteAsync(int id, string userId, bool isAdmin);
    Task<ReviewGetDto> UpdateAsync(int id, ReviewUpdateDto dto, string userId);
}
