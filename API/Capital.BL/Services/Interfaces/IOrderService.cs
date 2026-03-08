using Capital.BL.DTOs.OrderDtos;

namespace Capital.BL.Services.Interfaces;

public interface IOrderService
{
    Task<OrderDetailDto> CreateAsync(OrderCreateDto dto);
    Task<IEnumerable<OrderGetDto>> GetMyOrdersAsync();
    Task<OrderDetailDto> GetByIdAsync(int id);
    Task<IEnumerable<OrderGetDto>> GetAllAsync();
    Task<OrderDetailDto> UpdateStatusAsync(int id, string status);
}

