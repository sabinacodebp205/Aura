using Aura.Application.DTOs.Favorite;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.Favorite
{
    public class FavoriteGetDtoValidator : AbstractValidator<FavoriteGetDto>
    {
        public FavoriteGetDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Favorite ID is required.");

            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Product ID is required.");

            RuleFor(x => x.ProductName)
                .NotEmpty().WithMessage("Product name is required.")
                .MaximumLength(150).WithMessage("Product name cannot exceed 150 characters.");

            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Price cannot be negative.");

            RuleFor(x => x.ImageUrl)
                .NotEmpty().WithMessage("Image URL is required.");
        }
    }
}
