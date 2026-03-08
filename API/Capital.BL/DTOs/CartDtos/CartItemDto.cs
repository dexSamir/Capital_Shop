namespace Capital.BL.DTOs.CartDtos;

public class CartItemDto
{
    public int ProductId { get; set; }
    public string ProductTitle { get; set; } = null!;
    public string CoverImage { get; set; } = null!;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
}

