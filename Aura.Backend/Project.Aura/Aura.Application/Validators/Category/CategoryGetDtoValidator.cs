using Aura.Application.DTOs.Category;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.Category
{
    public class CategoryGetDtoValidator : AbstractValidator<CategoryGetDto>
    {
        public CategoryGetDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Category ID is required.");

            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Category name is required.")
                .MaximumLength(100)
                .WithMessage("Category name cannot exceed 100 characters.");
        }
    }
}
