using Capital.BL.DTOs.CartDtos;
using Capital.BL.Exceptions.Common;
using Capital.BL.ExternalServices.Interfaces;
using Capital.BL.Services.Interfaces;
using Capital.Core.Entities;
using Capital.Core.Repositories;

namespace Capital.BL.Services.Implements;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly ICartItemRepository _cartItemRepository;
    private readonly IProductRepository _productRepository;
    private readonly ICurrentUser _currentUser;
    private readonly IMapper _mapper;

    public CartService(
        ICartRepository cartRepository,
        ICartItemRepository cartItemRepository,
        IProductRepository productRepository,
        ICurrentUser currentUser,
        IMapper mapper)
    {
        _cartRepository = cartRepository;
        _cartItemRepository = cartItemRepository;
        _productRepository = productRepository;
        _currentUser = currentUser;
        _mapper = mapper;
    }

    public async Task<CartGetDto> GetOrCreateAsync()
    {
        var userId = _currentUser.GetId();

        var cart = (await _cartRepository
                .GetWhereAsync(c => c.UserId == userId, includes: new[] { "Items", "Items.Product" }))
            .FirstOrDefault();

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
                CreatedTime = DateTime.UtcNow
            };

            await _cartRepository.AddAsync(cart);
            await _cartRepository.SaveAsync();
        }

        // Reload with includes if newly created
        if (cart.Items == null || !cart.Items.Any())
        {
            cart = await _cartRepository.GetByIdAsync(cart.Id, "Items", "Items.Product")
                   ?? cart;
        }

        return _mapper.Map<CartGetDto>(cart);
    }

    public async Task<CartGetDto> AddOrUpdateItemAsync(CartItemUpdateDto dto)
    {
        if (dto.Quantity < 0)
            throw new BadRequestException("Quantity cannot be negative.");

        var userId = _currentUser.GetId();

        var cart = (await _cartRepository
                .GetWhereAsync(c => c.UserId == userId, includes: new[] { "Items", "Items.Product" }))
            .FirstOrDefault();

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
                CreatedTime = DateTime.UtcNow
            };

            await _cartRepository.AddAsync(cart);
            await _cartRepository.SaveAsync();

            cart = await _cartRepository.GetByIdAsync(cart.Id, "Items", "Items.Product")
                   ?? cart;
        }

        var product = await _productRepository.GetByIdAsync(dto.ProductId)
                      ?? throw new NotFoundException<Product>();

        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == dto.ProductId);

        if (dto.Quantity == 0)
        {
            if (existingItem != null)
            {
                await _cartItemRepository.HardDeleteAsync(existingItem.Id);
                await _cartItemRepository.SaveAsync();
            }
        }
        else
        {
            if (existingItem == null)
            {
                var newItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = product.Id,
                    Quantity = dto.Quantity,
                    UnitPrice = product.SellPrice,
                    TotalPrice = product.SellPrice * dto.Quantity,
                    CreatedTime = DateTime.UtcNow
                };

                await _cartItemRepository.AddAsync(newItem);
            }
            else
            {
                existingItem.Quantity = dto.Quantity;
                existingItem.UnitPrice = product.SellPrice;
                existingItem.TotalPrice = product.SellPrice * dto.Quantity;
                existingItem.UpdatedTime = DateTime.UtcNow;

                _cartItemRepository.UpdateAsync(existingItem);
            }

            await _cartItemRepository.SaveAsync();
        }

        var updatedCart = await _cartRepository.GetByIdAsync(cart.Id, "Items", "Items.Product")
                         ?? cart;

        return _mapper.Map<CartGetDto>(updatedCart);
    }

    public async Task<CartGetDto> RemoveItemAsync(int productId)
    {
        var userId = _currentUser.GetId();

        var cart = (await _cartRepository
                .GetWhereAsync(c => c.UserId == userId, includes: new[] { "Items", "Items.Product" }))
            .FirstOrDefault()
            ?? throw new NotFoundException<Cart>();

        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);
        if (existingItem != null)
        {
            await _cartItemRepository.HardDeleteAsync(existingItem.Id);
            await _cartItemRepository.SaveAsync();
        }

        var updatedCart = await _cartRepository.GetByIdAsync(cart.Id, "Items", "Items.Product")
                         ?? cart;

        return _mapper.Map<CartGetDto>(updatedCart);
    }

    public async Task ClearAsync()
    {
        var userId = _currentUser.GetId();

        var cart = (await _cartRepository
                .GetWhereAsync(c => c.UserId == userId, includes: new[] { "Items" }))
            .FirstOrDefault();

        if (cart == null || !cart.Items.Any())
            return;

        var itemIds = cart.Items.Select(i => i.Id).ToArray();
        await _cartItemRepository.HardDeleteRangeAsync(itemIds);
        await _cartItemRepository.SaveAsync();
    }
}

