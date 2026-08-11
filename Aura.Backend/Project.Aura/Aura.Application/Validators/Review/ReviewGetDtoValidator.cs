using Aura.Application.DTOs.Review;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.Review
{
    public class ReviewGetDtoValidator : AbstractValidator<ReviewGetDto>
    {
        public ReviewGetDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Review ID is required.");

            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5)
                .WithMessage("Rating must be between 1 and 5.");

            RuleFor(x => x.Comment)
                .NotEmpty().WithMessage("Comment is required.")
                .MaximumLength(1000).WithMessage("Comment cannot exceed 1000 characters.");

            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("User name is required.")
                .MaximumLength(100).WithMessage("User name cannot exceed 100 characters.");
        }
    }
}
