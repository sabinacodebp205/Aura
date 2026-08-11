using Aura.Application.DTOs.ProductImage;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.ProductImage
{
    public class ProductImageCreateDtoValidator : AbstractValidator<ProductImageCreateDto>
    {
        public ProductImageCreateDtoValidator()
        {
            RuleFor(x => x.ImageFile)
                .NotNull().WithMessage("Image is required.");

            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Product ID is required.");
        }
    }
}
