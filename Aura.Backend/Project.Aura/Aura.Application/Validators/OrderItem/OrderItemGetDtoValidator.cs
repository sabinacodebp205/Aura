using Aura.Application.DTOs.OrderItem;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.OrderItem
{
    public class OrderItemGetDtoValidator : AbstractValidator<OrderItemGetDto>
    {
        public OrderItemGetDtoValidator()
        {
            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Product ID is required.");

            RuleFor(x => x.ProductName)
                .NotEmpty().WithMessage("Product name is required.")
                .MaximumLength(150).WithMessage("Product name cannot exceed 150 characters.");

            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0).WithMessage("Price cannot be negative.");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than 0.");

            RuleFor(x => x.ImageUrl)
                .MaximumLength(500)
                .When(x => !string.IsNullOrWhiteSpace(x.ImageUrl))
                .WithMessage("Image URL cannot exceed 500 characters.");
        }
    }
}
