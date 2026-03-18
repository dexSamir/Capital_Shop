using Capital.BL.DTOs.ProductDtos;
using Capital.Core.Entities;

namespace Capital.BL.Profiles;

public class ProductProfile : Profile
{
	public ProductProfile()
	{
        CreateMap<Product, ProductGetDto>()
               .ForMember(dest => dest.CoverImage,
                   opt => opt.MapFrom(src => src.Images.FirstOrDefault(x => x.IsPrimary).ImageUrl))
               .ForMember(dest => dest.SecondImage,
                   opt => opt.MapFrom(src => src.Images.FirstOrDefault(x => x.IsSecondary).ImageUrl))
               .ForMember(dest => dest.Images,
                   opt => opt.MapFrom(src => src.Images.Select(i => i.ImageUrl)));

        CreateMap<Product, ProductDetailDto>()
            .ForMember(dest => dest.CoverImage,
                opt => opt.MapFrom(src => src.Images.FirstOrDefault(x => x.IsPrimary).ImageUrl))
            .ForMember(dest => dest.SecondImage,
                opt => opt.MapFrom(src => src.Images.FirstOrDefault(x => x.IsSecondary).ImageUrl))
            .ForMember(dest => dest.Images,
                opt => opt.MapFrom(src => src.Images.Select(i => i.ImageUrl)));

        CreateMap<ProductCreateDto, Product>();
        CreateMap<ProductUpdateDto, Product>();
    }
}

