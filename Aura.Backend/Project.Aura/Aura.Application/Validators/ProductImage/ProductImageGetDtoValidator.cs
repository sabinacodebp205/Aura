using Aura.Application.DTOs.ProductImage;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.ProductImage
{
    public class ProductImageGetDtoValidator : AbstractValidator<ProductImageGetDto>
    {
        public ProductImageGetDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Image ID is required.");

            RuleFor(x => x.ImageUrl)
                .NotEmpty().WithMessage("Image URL is required.")
                .MaximumLength(500).WithMessage("Image URL cannot exceed 500 characters.");
        }
    }
}
