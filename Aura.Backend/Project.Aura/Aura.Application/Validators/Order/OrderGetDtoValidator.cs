using Aura.Application.DTOs.Order;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.Order
{
    public class OrderGetDtoValidator : AbstractValidator<OrderGetDto>
    {
        public OrderGetDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Order ID is required.");

            RuleFor(x => x.TotalPrice)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Total price cannot be negative.");

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid order status.");

            RuleFor(x => x.PaymentStatus)
                .IsInEnum().WithMessage("Invalid payment status.");

            RuleFor(x => x.OrderItems)
                .NotNull().WithMessage("Order items cannot be null.");
        }
    }
}
