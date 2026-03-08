namespace Capital.BL.DTOs.OrderDtos;

public class OrderGetDto
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; } = null!;
    public decimal TotalAmount { get; set; }
}

