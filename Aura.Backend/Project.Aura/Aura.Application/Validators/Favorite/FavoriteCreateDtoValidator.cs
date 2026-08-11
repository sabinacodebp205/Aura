using Aura.Application.DTOs.Favorite;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Application.Validators.Favorite
{
    public class FavoriteCreateDtoValidator : AbstractValidator<FavoriteCreateDto>
    {
        public FavoriteCreateDtoValidator()
        {
            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Product ID is required.");
        }
    }

}
