using Capital.Core.Entities.Base;
using Capital.Core.Helper.Enums;

namespace Capital.Core.Entities;
public class Coupon : BaseEntity
{
	public string Title { get; set; } = null!;
	public string? Description { get; set; }
	public EDiscountType DiscountType { get; set; }
	public DateTime EndTime { get; set; }
	public string CouponCode { get; set; } = null!;
	public int? UsageLimit { get; set; }
	public int? UsageCount { get; set; }
	public bool IsActive { get; set; }
	public decimal DiscountValue { get; set; }
	public int? MinimumOrderAmount { get; set; }

	public IEnumerable<Product>? Products { get; set; }
}

