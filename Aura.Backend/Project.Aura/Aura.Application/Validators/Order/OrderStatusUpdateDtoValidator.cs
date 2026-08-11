using Aura.Application.DTOs.Order;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.Order
{
    public class OrderStatusUpdateDtoValidator : AbstractValidator<OrderStatusUpdateDto>
    {
        public OrderStatusUpdateDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Order ID is required.");

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid order status.");
        }
    }
}
