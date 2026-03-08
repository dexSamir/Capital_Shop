using Capital.BL.DTOs.CartDtos;

namespace Capital.BL.Services.Interfaces;

public interface ICartService
{
    Task<CartGetDto> GetOrCreateAsync();
    Task<CartGetDto> AddOrUpdateItemAsync(CartItemUpdateDto dto);
    Task<CartGetDto> RemoveItemAsync(int productId);
    Task ClearAsync();
}

