using AutoMapper;
using Capital.BL.DTOs.CategoryDtos;
using Capital.Core.Entities;

namespace Capital.BL.Profiles;
public class CategoryProfile : Profile
{
	public CategoryProfile()
	{
		CreateMap<CategoryCreateDto, Category>();
        CreateMap<CategoryUpdateDto, Category>()
            .ForAllMembers(opt =>
        opt.Condition((src, dest, srcMember) => srcMember != null));
        CreateMap<Category, CategoryGetDto>();


    }
}

