namespace Capital.BL.DTOs.CartDtos;

public class CartGetDto
{
    public int Id { get; set; }
    public decimal TotalAmount { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
}

