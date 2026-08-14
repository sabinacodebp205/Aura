using Aura.Application.DTOs.ProductImage;
using Aura.Core.Interfaces.Repositories;
using FluentValidation;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Aura.Application.Validators.ProductImage
{
    public class ProductImageCreateDtoValidator : AbstractValidator<ProductImageCreateDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductImageCreateDtoValidator(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;

            RuleFor(x => x.ImageFile)
                .NotNull().WithMessage("Image is required.");

            RuleFor(x => x.ProductId)
                .NotEmpty().WithMessage("Product ID is required.")
                .MustAsync(ProductExistsAsync).WithMessage("Referenced Product does not exist.");
        }

        private async Task<bool> ProductExistsAsync(Guid productId, CancellationToken cancellationToken)
        {
            if (productId == Guid.Empty) return false;
            return await _unitOfWork.ProductRepository.AnyAsync(x => x.Id == productId);
        }
    }
}
