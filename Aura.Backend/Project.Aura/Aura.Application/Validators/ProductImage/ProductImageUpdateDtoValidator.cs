using Aura.Application.DTOs.ProductImage;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.ProductImage
{
    public class ProductImageUpdateDtoValidator : AbstractValidator<ProductImageUpdateDto>
    {
        public ProductImageUpdateDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Image ID is required.");

            RuleFor(x => x.ImageFile)
                .NotNull().WithMessage("Image is required.");
        }
    }
}
