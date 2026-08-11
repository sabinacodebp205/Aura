using Aura.Application.DTOs.Design;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.Design
{
    public class DesignUpdateDtoValidator : AbstractValidator<DesignUpdateDto>
    {
        public DesignUpdateDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Design ID is required.");

            RuleFor(x => x.Prompt)
                .NotEmpty().WithMessage("Prompt is required.")
                .MaximumLength(1000).WithMessage("Prompt cannot exceed 1000 characters.");
        }
    }
}
