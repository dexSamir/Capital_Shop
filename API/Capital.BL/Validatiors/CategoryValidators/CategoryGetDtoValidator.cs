using Capital.BL.DTOs.CategoryDtos;
using FluentValidation;
namespace Capital.BL.Validatiors.CategoryValidators;

public class CategoryGetDtoValidator : AbstractValidator<CategoryGetDto>
{
	public CategoryGetDtoValidator()
	{
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Id must be greater than 0.");

        RuleFor(x => x.Title)
            .NotNull()
            .WithMessage("Title is required.")
            .NotEmpty()
            .WithMessage("Title cannot be empty.")
            .MaximumLength(100)
            .WithMessage("Title cannot exceed 100 characters.");

        RuleFor(x => x.ImageUrl)
            .NotNull()
            .WithMessage("ImageUrl is required.")
            .NotEmpty()
            .MaximumLength(255)
            .WithMessage("ImageUrl cannot be empty.");

        RuleFor(x => x.CreatedTime)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("CreatedTime cannot be in the future.");

        RuleFor(x => x.UpdatedTime)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .When(x => x.UpdatedTime.HasValue)
            .WithMessage("UpdatedTime cannot be in the future.");
    }
}

