using Capital.BL.DTOs.CategoryDtos;
using FluentValidation;
namespace Capital.BL.Validatiors.CategoryValidators;

public class CategoryUpdateDtoValidator : AbstractValidator<CategoryUpdateDto>
{
	public CategoryUpdateDtoValidator()
	{
        RuleFor(x => x.Title)
            .MaximumLength(100)
            .When(x => !string.IsNullOrWhiteSpace(x.Title))
            .WithMessage("Title must be less than 100 charachters!");

        RuleFor(x => x.ImageUrl)
            .Must(file => file == null || file.Length > 0)
            .WithMessage("An empty image file cannot be uploaded!");
    }
}
