using Capital.BL.DTOs.ProductDtos;
using Capital.Core.Entities;

namespace Capital.BL.Profiles;

public class ProductProfile : Profile
{
	public ProductProfile()
	{
        CreateMap<Product, ProductGetDto>()
               .ForMember(dest => dest.CoverImage,
                   opt => opt.MapFrom(src =>
                       src.Images != null && src.Images.Any(x => x.IsPrimary)
                           ? src.Images.First(x => x.IsPrimary).ImageUrl
                           : src.CoverImage))
               .ForMember(dest => dest.SecondImage,
                   opt => opt.MapFrom(src =>
                       src.Images != null && src.Images.Any(x => x.IsSecondary)
                           ? src.Images.First(x => x.IsSecondary).ImageUrl
                           : src.SecondImage))
               .ForMember(dest => dest.Images,
                   opt => opt.MapFrom(src =>
                       src.Images != null ? src.Images.Select(i => i.ImageUrl) : null));

        CreateMap<Product, ProductDetailDto>()
            .ForMember(dest => dest.CoverImage,
                opt => opt.MapFrom(src =>
                    src.Images != null && src.Images.Any(x => x.IsPrimary)
                        ? src.Images.First(x => x.IsPrimary).ImageUrl
                        : src.CoverImage))
            .ForMember(dest => dest.SecondImage,
                opt => opt.MapFrom(src =>
                    src.Images != null && src.Images.Any(x => x.IsSecondary)
                        ? src.Images.First(x => x.IsSecondary).ImageUrl
                        : src.SecondImage))
            .ForMember(dest => dest.Images,
                opt => opt.MapFrom(src =>
                    src.Images != null ? src.Images.Select(i => i.ImageUrl) : null));

        CreateMap<ProductCreateDto, Product>();
        CreateMap<ProductUpdateDto, Product>();
    }
}

