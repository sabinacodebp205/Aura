using Aura.Application.DTOs.Design;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.Design
{
    public class DesignGetDtoValidator : AbstractValidator<DesignGetDto>
    {
        public DesignGetDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Design ID is required.");

            RuleFor(x => x.Prompt)
                .NotEmpty().WithMessage("Prompt is required.")
                .MaximumLength(1000).WithMessage("Prompt cannot exceed 1000 characters.");

            RuleFor(x => x.ImageUrl)
                .NotEmpty().WithMessage("Image URL is required.");

            RuleFor(x => x.ExtraPrice)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Extra price cannot be negative.");

            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Product ID is required.");
        }
    }
}
