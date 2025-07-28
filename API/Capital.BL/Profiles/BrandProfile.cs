using Capital.BL.DTOs.BrandDtos;
using Capital.Core.Entities;

namespace Capital.BL.Profiles;

public class BrandProfile : Profile 
{
	public BrandProfile()
	{
		CreateMap<BrandCreateDto, Brand>();
		CreateMap<BrandUpdateDto, Brand>()
            .ForAllMembers(opt =>
        opt.Condition((src, dest, srcMember) => srcMember != null));
		CreateMap<Brand, BrandGetDto>(); 
	}
}

