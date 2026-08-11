using Aura.Application.DTOs.Design;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.Design
{
    public class DesignCreateDtoValidator : AbstractValidator<DesignCreateDto>
    {
        public DesignCreateDtoValidator()
        {
            RuleFor(x => x.Prompt)
                .NotEmpty().WithMessage("Prompt is required.")
                .MaximumLength(1000).WithMessage("Prompt cannot exceed 1000 characters.");

            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Product ID is required.");
        }
    }
}
