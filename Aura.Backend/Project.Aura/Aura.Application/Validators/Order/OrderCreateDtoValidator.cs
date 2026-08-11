using Aura.Application.DTOs.Order;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.Order
{
    public class OrderCreateDtoValidator : AbstractValidator<OrderCreateDto>
    {
        public OrderCreateDtoValidator()
        {
            RuleFor(x => x.AddressId)
                .NotEmpty().WithMessage("Address is required.");

            RuleFor(x => x.OrderItems)
                .NotEmpty().WithMessage("Order must contain at least one item.");
        }
    }
}
