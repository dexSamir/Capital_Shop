using Capital.BL.DTOs.CartDtos;
using Capital.Core.Entities;

namespace Capital.BL.Profiles;

public class CartProfile : Profile
{
    public CartProfile()
    {
        CreateMap<Cart, CartGetDto>()
            .ForMember(dest => dest.TotalAmount,
                opt => opt.MapFrom(src => src.Items.Sum(i => i.TotalPrice)));

        CreateMap<CartItem, CartItemDto>()
            .ForMember(dest => dest.ProductTitle, opt => opt.MapFrom(src => src.Product.Title))
            .ForMember(dest => dest.CoverImage, opt => opt.MapFrom(src => src.Product.CoverImage));
    }
}

