using AutoMapper;
using Capital.BL.DTOs.ReviewDtos;
using Capital.Core.Entities;

namespace Capital.BL.Profiles;

public class ReviewProfile : Profile
{
    public ReviewProfile()
    {
        CreateMap<Review, ReviewGetDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User != null ? src.User.Name + " " + src.User.Surname : "Anonymous"))
            .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.RatingId.HasValue ? src.Rating.Rating : 0));

        CreateMap<ReviewCreateDto, Review>();
    }
}
