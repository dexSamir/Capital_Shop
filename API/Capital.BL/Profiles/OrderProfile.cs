using Capital.BL.DTOs.OrderDtos;
using Capital.Core.Entities;

namespace Capital.BL.Profiles;

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<Order, OrderGetDto>();

        CreateMap<Order, OrderDetailDto>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items));

        CreateMap<OrderItem, OrderItemDto>()
            .ForMember(dest => dest.ProductTitle, opt => opt.MapFrom(src => src.Product.Title));
    }
}

