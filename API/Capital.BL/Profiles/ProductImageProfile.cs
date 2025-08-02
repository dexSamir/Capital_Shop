using Capital.BL.DTOs.ProductImageDto;
using Capital.Core.Entities;

namespace Capital.BL.Profiles;

public class ProductImageProfile : Profile
{
	public ProductImageProfile()
	{
		CreateMap<ProductImageCreateDto, ProductImage>();
		CreateMap<ProductImage, ProductImageGetDto>(); 
	}
}

