using Aura.Application.DTOs.Product;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.Product
{
    public class ProductUpdateDtoValidator : AbstractValidator<ProductUpdateDto>
    {
        public ProductUpdateDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Product ID is required.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Product name is required.")
                .MaximumLength(150).WithMessage("Product name cannot exceed 150 characters.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0.");

            RuleFor(x => x.StockCount)
                .GreaterThanOrEqualTo(0).WithMessage("Stock count cannot be negative.");

            RuleFor(x => x.Color)
                .NotEmpty().WithMessage("Color is required.")
                .MaximumLength(50).WithMessage("Color cannot exceed 50 characters.");

            RuleFor(x => x.Size)
                .NotEmpty().WithMessage("Size is required.")
                .MaximumLength(20).WithMessage("Size cannot exceed 20 characters.");

            RuleFor(x => x.CategoryId)
                .NotEmpty().WithMessage("Category is required.");
        }
    }
}
