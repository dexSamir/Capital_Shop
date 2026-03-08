namespace Capital.BL.DTOs.OrderDtos;

public class OrderItemDto
{
    public int ProductId { get; set; }
    public string ProductTitle { get; set; } = null!;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
}

