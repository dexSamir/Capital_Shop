using Capital.BL.DTOs.OrderDtos;
using Capital.BL.Exceptions.Auth;
using Capital.BL.Exceptions.Common;
using Capital.BL.ExternalServices.Interfaces;
using Capital.BL.Services.Interfaces;
using Capital.Core.Entities;
using Capital.Core.Repositories;

namespace Capital.BL.Services.Implements;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly ICurrentUser _currentUser;
    private readonly IMapper _mapper;

    public OrderService(
        IOrderRepository orderRepository,
        IProductRepository productRepository,
        ICurrentUser currentUser,
        IMapper mapper)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _currentUser = currentUser;
        _mapper = mapper;
    }

    public async Task<OrderDetailDto> CreateAsync(OrderCreateDto dto)
    {
        var userId = _currentUser.GetId();

        if (dto.Items == null || dto.Items.Count == 0)
            throw new BadRequestException("Order must contain at least one item.");

        var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToArray();
        var products = (await _productRepository.GetWhereAsync(p => productIds.Contains(p.Id))).ToList();

        if (products.Count != productIds.Length)
            throw new NotFoundException<Product>("One or more products were not found.");

        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            Status = "Pending",
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address,
            City = dto.City,
            State = dto.State,
            ZipCode = dto.ZipCode,
            Country = dto.Country,
            CreatedTime = DateTime.UtcNow
        };

        decimal total = 0;
        foreach (var itemDto in dto.Items)
        {
            var product = products.First(p => p.Id == itemDto.ProductId);
            var unitPrice = product.SellPrice;
            var lineTotal = unitPrice * itemDto.Quantity;

            var orderItem = new OrderItem
            {
                ProductId = product.Id,
                Quantity = itemDto.Quantity,
                UnitPrice = unitPrice,
                TotalPrice = lineTotal,
                CreatedTime = DateTime.UtcNow
            };

            order.Items.Add(orderItem);
            total += lineTotal;
        }

        order.TotalAmount = total;

        await _orderRepository.AddAsync(order);
        await _orderRepository.SaveAsync();

        // Reload with items and product for mapping
        var created = await _orderRepository.GetByIdAsync(order.Id, "Items", "Items.Product")
                      ?? throw new NotFoundException<Order>();

        return _mapper.Map<OrderDetailDto>(created);
    }

    public async Task<IEnumerable<OrderGetDto>> GetMyOrdersAsync()
    {
        var userId = _currentUser.GetId();
        var orders = await _orderRepository.GetWhereAsync(o => o.UserId == userId);
        return _mapper.Map<IEnumerable<OrderGetDto>>(orders);
    }

    public async Task<OrderDetailDto> GetByIdAsync(int id)
    {
        var userId = _currentUser.GetId();
        var isAdmin = _currentUser.IsInRole("Admin");

        var order = await _orderRepository.GetByIdAsync(id, "Items", "Items.Product")
                    ?? throw new NotFoundException<Order>();

        if (!isAdmin && order.UserId != userId)
            throw new AuthorisationException<Order>();

        return _mapper.Map<OrderDetailDto>(order);
    }

    public async Task<IEnumerable<OrderGetDto>> GetAllAsync()
    {
        var orders = await _orderRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<OrderGetDto>>(orders);
    }

    public async Task<OrderDetailDto> UpdateStatusAsync(int id, string status)
    {
        if (string.IsNullOrWhiteSpace(status))
            throw new BadRequestException("Status is required.");

        var order = await _orderRepository.GetByIdAsync(id, "Items", "Items.Product")
                    ?? throw new NotFoundException<Order>();

        order.Status = status;
        order.UpdatedTime = DateTime.UtcNow;

        _orderRepository.UpdateAsync(order);
        await _orderRepository.SaveAsync();

        return _mapper.Map<OrderDetailDto>(order);
    }
}

