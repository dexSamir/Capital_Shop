using Capital.BL.DTOs.CategoryDtos;
using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Capital.BL.Validatiors.CategoryValidators;

public class CategoryCreateDtoValidator : AbstractValidator<CategoryCreateDto>
{
	public CategoryCreateDtoValidator()
	{
		RuleFor(x => x.Title)
			.NotNull()
			.MaximumLength(100)
			.NotEmpty()
            .WithMessage("Title is required.");

        RuleFor(x => x.ImageUrl)
            .NotNull()
            .Must(file => file.Length > 0)
            .WithMessage("Image file is required.");
    }
}

