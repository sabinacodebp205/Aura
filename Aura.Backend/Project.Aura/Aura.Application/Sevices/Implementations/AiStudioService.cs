using Aura.Application.DTOs.AiStudio;
using Aura.Application.Sevices.Interfaces;
using Aura.Core.Entities;
using Aura.Core.Enums;
using Aura.Core.Interfaces.Repositories;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Implementations
{
    public class AiStudioService : IAiStudioService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        private static readonly string[] ProhibitedKeywords = new[]
        {
            "hate", "violence", "explicit", "nude", "illegal", "toxic", "offensive"
        };

        private static readonly Dictionary<string, string> BaseGarmentImages = new(StringComparer.OrdinalIgnoreCase)
        {
            { "tshirt", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85" },
            { "oversized_tshirt", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85" },
            { "fitted_tshirt", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85" },
            { "long_sleeve", "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85" },
            { "tank_top", "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1000&q=85" },
            { "crop_top", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85" },
            { "blouse", "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=85" },
            { "sweatshirt", "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85" },
            { "quarter_zip", "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1000&q=85" },
            { "hoodie", "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85" },
            { "zip_hoodie", "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=85" }
        };

        public AiStudioService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public Task<ChatResponseDto> ProcessChatAsync(ChatRequestDto dto)
        {
            var msg = dto.UserMessage?.Trim().ToLowerInvariant() ?? string.Empty;
            var updatedSpec = dto.CurrentSpec ?? new DesignSpecDto();
            updatedSpec.UpdatedAt = DateTime.UtcNow;

            if (string.IsNullOrWhiteSpace(msg))
            {
                return Task.FromResult(new ChatResponseDto
                {
                    Reply = "Could you tell me a bit more about the piece you want to design? For instance, garment type, preferred color, or style theme.",
                    UpdatedSpec = updatedSpec,
                    NeedsClarification = true,
                    SuggestedOptions = new List<string> { "Hoodie", "Oversized Tee", "Streetwear", "Minimalist" }
                });
            }

            // 1. Extract Garment Type
            if (msg.Contains("zip hoodie") || msg.Contains("zip-up")) updatedSpec.GarmentType = "zip_hoodie";
            else if (msg.Contains("oversized t-shirt") || msg.Contains("oversized tee")) updatedSpec.GarmentType = "oversized_tshirt";
            else if (msg.Contains("fitted t-shirt") || msg.Contains("fitted tee")) updatedSpec.GarmentType = "fitted_tshirt";
            else if (msg.Contains("t-shirt") || msg.Contains("tshirt") || msg.Contains("tee")) updatedSpec.GarmentType = "tshirt";
            else if (msg.Contains("long sleeve")) updatedSpec.GarmentType = "long_sleeve";
            else if (msg.Contains("tank top") || msg.Contains("tank")) updatedSpec.GarmentType = "tank_top";
            else if (msg.Contains("crop top")) updatedSpec.GarmentType = "crop_top";
            else if (msg.Contains("quarter zip") || msg.Contains("1/4 zip")) updatedSpec.GarmentType = "quarter_zip";
            else if (msg.Contains("sweatshirt") || msg.Contains("crewneck")) updatedSpec.GarmentType = "sweatshirt";
            else if (msg.Contains("hoodie")) updatedSpec.GarmentType = "hoodie";

            // 2. Extract Color
            if (msg.Contains("black")) updatedSpec.Color = "black";
            else if (msg.Contains("white")) updatedSpec.Color = "white";
            else if (msg.Contains("grey") || msg.Contains("gray")) updatedSpec.Color = "grey";
            else if (msg.Contains("beige") || msg.Contains("sand")) updatedSpec.Color = "beige";
            else if (msg.Contains("charcoal")) updatedSpec.Color = "charcoal";
            else if (msg.Contains("navy")) updatedSpec.Color = "navy";
            else if (msg.Contains("olive") || msg.Contains("green")) updatedSpec.Color = "olive";
            else if (msg.Contains("cream")) updatedSpec.Color = "cream";

            // 3. Extract Style
            if (msg.Contains("streetwear")) updatedSpec.Style = "streetwear";
            else if (msg.Contains("minimal") || msg.Contains("minimalist")) updatedSpec.Style = "minimal";
            else if (msg.Contains("grunge")) updatedSpec.Style = "grunge";
            else if (msg.Contains("gothic")) updatedSpec.Style = "gothic";
            else if (msg.Contains("vintage") || msg.Contains("retro")) updatedSpec.Style = "vintage";
            else if (msg.Contains("luxury")) updatedSpec.Style = "luxury";
            else if (msg.Contains("artistic")) updatedSpec.Style = "artistic";
            else if (msg.Contains("motivational") || msg.Contains("quote")) updatedSpec.Style = "motivational";

            // 4. Extract Placement
            if (msg.Contains("left chest") || msg.Contains("small chest")) updatedSpec.Placement = "left_chest";
            else if (msg.Contains("right chest")) updatedSpec.Placement = "right_chest";
            else if (msg.Contains("back print") || msg.Contains("on the back")) updatedSpec.Placement = "back";
            else if (msg.Contains("sleeve")) updatedSpec.Placement = "sleeve";
            else if (msg.Contains("center") || msg.Contains("front")) updatedSpec.Placement = "center";

            // 5. Extract Print Size
            if (msg.Contains("small print") || msg.Contains("discreet")) updatedSpec.PrintSize = "small";
            else if (msg.Contains("large print") || msg.Contains("oversized graphic")) updatedSpec.PrintSize = "large";
            else if (msg.Contains("medium print")) updatedSpec.PrintSize = "medium";

            // Update user's prompt text
            if (string.IsNullOrWhiteSpace(updatedSpec.Prompt))
            {
                updatedSpec.Prompt = dto.UserMessage;
            }
            else
            {
                updatedSpec.Prompt += $"; {dto.UserMessage}";
            }

            // Determine assistant response & clarification
            string reply;
            bool needsClarification = false;
            List<string>? suggestions = null;

            var readableGarment = updatedSpec.GarmentType.Replace("_", " ");
            var hasGraphic = !string.IsNullOrWhiteSpace(updatedSpec.Prompt) || !string.IsNullOrWhiteSpace(updatedSpec.UploadedPatternUrl);

            if (string.IsNullOrWhiteSpace(updatedSpec.Style))
            {
                reply = $"Got it — a custom {updatedSpec.Color} {readableGarment}. What vibe or style direction do you have in mind for this piece?";
                needsClarification = true;
                suggestions = new List<string> { "Minimalist", "Streetwear", "Gothic Architectural", "Vintage Editorial" };
            }
            else if (string.IsNullOrWhiteSpace(updatedSpec.Placement))
            {
                reply = $"Looking sleek! Where would you like the graphic positioned on your {updatedSpec.Color} {readableGarment}?";
                needsClarification = true;
                suggestions = new List<string> { "Center Front", "Left Chest", "Full Back", "Sleeve Print" };
            }
            else if (!hasGraphic)
            {
                reply = $"Great setup for your {updatedSpec.Color} {readableGarment} ({updatedSpec.Style} style). Describe the artwork concept or upload a PNG graphic pattern.";
                needsClarification = true;
                suggestions = new List<string> { "Abstract geometric lines", "Monochrome butterfly motif", "Minimalist typographic emblem" };
            }
            else
            {
                reply = $"Your spec is ready! I've locked in a {updatedSpec.Color} {readableGarment} with {updatedSpec.Style ?? "custom"} aesthetic and {updatedSpec.Placement ?? "center"} placement. Click 'Continue to Generator' below to render your high-resolution mockup!";
                updatedSpec.Status = "draft";
            }

            return Task.FromResult(new ChatResponseDto
            {
                Reply = reply,
                UpdatedSpec = updatedSpec,
                NeedsClarification = needsClarification,
                SuggestedOptions = suggestions
            });
        }

        public Task<GenerateResponseDto> GenerateGarmentDesignAsync(GenerateRequestDto dto)
        {
            var spec = dto.Spec ?? throw new ArgumentException("Design spec is required.");

            if (string.IsNullOrWhiteSpace(spec.GarmentType) || string.IsNullOrWhiteSpace(spec.Color))
            {
                return Task.FromResult(new GenerateResponseDto
                {
                    Status = "failed",
                    ErrorReason = "Garment type and color are required before generating."
                });
            }

            if (string.IsNullOrWhiteSpace(spec.Prompt) && string.IsNullOrWhiteSpace(spec.UploadedPatternUrl))
            {
                return Task.FromResult(new GenerateResponseDto
                {
                    Status = "failed",
                    ErrorReason = "Either a text prompt description or an uploaded PNG graphic pattern is required."
                });
            }

            // Moderation check on prompt
            if (!string.IsNullOrWhiteSpace(spec.Prompt))
            {
                foreach (var kw in ProhibitedKeywords)
                {
                    if (spec.Prompt.IndexOf(kw, StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        return Task.FromResult(new GenerateResponseDto
                        {
                            Status = "failed",
                            ErrorReason = $"Content moderation flag: prompt contains restricted term ('{kw}'). Please adjust your design description."
                        });
                    }
                }
            }

            spec.GenerationAttempts++;
            spec.Status = "generated";
            spec.UpdatedAt = DateTime.UtcNow;

            // Generate mockup preview image using base garment fallback or composite artwork URL
            string imageBaseUrl = BaseGarmentImages.TryGetValue(spec.GarmentType, out var url)
                ? url
                : BaseGarmentImages["hoodie"];

            spec.GeneratedImageUrl = imageBaseUrl;

            return Task.FromResult(new GenerateResponseDto
            {
                GeneratedImageUrl = imageBaseUrl,
                GenerationId = Guid.NewGuid().ToString(),
                Status = "success"
            });
        }

        public async Task<SavedDesignGetDto> SaveDesignAsync(SaveDesignDto dto, Guid? userId)
        {
            var spec = dto.Spec ?? throw new ArgumentException("Spec is required.");

            var design = new Design
            {
                Id = Guid.NewGuid(),
                Name = dto.Name ?? $"Custom {spec.Color.ToUpper()} {spec.GarmentType.Replace("_", " ").ToUpper()}",
                GarmentType = spec.GarmentType,
                Color = spec.Color,
                Prompt = spec.Prompt,
                ImageUrl = spec.GeneratedImageUrl ?? BaseGarmentImages.GetValueOrDefault(spec.GarmentType, BaseGarmentImages["hoodie"]),
                UploadedPatternUrl = spec.UploadedPatternUrl,
                Style = spec.Style,
                Placement = spec.Placement,
                PrintSize = spec.PrintSize,
                Status = "saved",
                GenerationAttempts = spec.GenerationAttempts > 0 ? spec.GenerationAttempts : 1,
                IsFavorite = false,
                ExtraPrice = 15.00m,
                UserId = userId
            };

            await _unitOfWork.DesignRepository.AddAsync(design);
            await _unitOfWork.SaveChangesAsync();

            return MapToGetDto(design);
        }

        public async Task<List<SavedDesignGetDto>> GetSavedDesignsAsync(Guid userId)
        {
            var designs = await _unitOfWork.DesignRepository.GetAllAsync();
            var userDesigns = designs.Where(d => d.UserId == userId).ToList();

            return userDesigns.Select(MapToGetDto).ToList();
        }

        public async Task<SavedDesignGetDto?> GetSavedDesignByIdAsync(Guid id)
        {
            var design = await _unitOfWork.DesignRepository.GetByIdAsync(id);
            return design == null ? null : MapToGetDto(design);
        }

        public async Task<SavedDesignGetDto> DuplicateDesignAsync(Guid id, Guid userId)
        {
            var existing = await _unitOfWork.DesignRepository.GetByIdAsync(id)
                ?? throw new Exception("Design not found.");

            var copy = new Design
            {
                Id = Guid.NewGuid(),
                Name = $"{existing.Name} (Copy)",
                GarmentType = existing.GarmentType,
                Color = existing.Color,
                Prompt = existing.Prompt,
                ImageUrl = existing.ImageUrl,
                UploadedPatternUrl = existing.UploadedPatternUrl,
                Style = existing.Style,
                Placement = existing.Placement,
                PrintSize = existing.PrintSize,
                Status = "saved",
                GenerationAttempts = existing.GenerationAttempts,
                IsFavorite = existing.IsFavorite,
                ExtraPrice = existing.ExtraPrice,
                UserId = userId
            };

            await _unitOfWork.DesignRepository.AddAsync(copy);
            await _unitOfWork.SaveChangesAsync();

            return MapToGetDto(copy);
        }

        public async Task DeleteSavedDesignAsync(Guid id, Guid userId)
        {
            var design = await _unitOfWork.DesignRepository.GetByIdAsync(id);
            if (design != null && design.UserId == userId)
            {
                _unitOfWork.DesignRepository.Delete(design);
                await _unitOfWork.SaveChangesAsync();
            }
        }

        public async Task<object> CreateCustomProductAsync(CustomProductCreateDto dto, Guid? userId)
        {
            var categories = await _unitOfWork.CategoryRepository.GetAllAsync();
            var defaultCategory = categories.FirstOrDefault() ?? new Category { Id = Guid.NewGuid(), Name = "Custom AI Collection" };

            var customProduct = new Product
            {
                Id = Guid.NewGuid(),
                Name = $"Custom {dto.Color.ToUpper()} {dto.GarmentType.Replace("_", " ").ToUpper()}",
                Description = $"High-end custom AI engineered garment ({dto.GarmentType}, Color: {dto.Color}, Size: {dto.Size ?? "M"}). Customization Fee applied.",
                Price = dto.BasePrice + dto.CustomizationFee,
                CustomizationFee = dto.CustomizationFee,
                StockCount = 999,
                Color = dto.Color,
                Size = dto.Size ?? "M",
                IsCustomizable = true,
                ProductType = ProductType.Custom,
                SourceDesignId = Guid.TryParse(dto.SourceDesignId, out var designGuid) ? designGuid : null,
                CategoryId = defaultCategory.Id
            };

            if (!string.IsNullOrWhiteSpace(dto.GeneratedImageUrl))
            {
                customProduct.Images.Add(new ProductImage
                {
                    Id = Guid.NewGuid(),
                    ImageUrl = dto.GeneratedImageUrl,
                    IsMain = true,
                    ProductId = customProduct.Id
                });
            }

            await _unitOfWork.ProductRepository.AddAsync(customProduct);
            await _unitOfWork.SaveChangesAsync();

            return new
            {
                id = customProduct.Id,
                productId = customProduct.Id,
                name = customProduct.Name,
                productType = "custom",
                basePrice = dto.BasePrice,
                customizationFee = dto.CustomizationFee,
                finalPrice = customProduct.Price,
                unitPrice = customProduct.Price,
                image = dto.GeneratedImageUrl,
                color = dto.Color,
                garmentType = dto.GarmentType,
                size = dto.Size ?? "M",
                sourceDesignId = dto.SourceDesignId
            };
        }

        private static SavedDesignGetDto MapToGetDto(Design d)
        {
            return new SavedDesignGetDto
            {
                Id = d.Id.ToString(),
                Name = d.Name,
                GarmentType = d.GarmentType,
                Color = d.Color,
                Prompt = d.Prompt,
                GeneratedImageUrl = d.ImageUrl,
                UploadedPatternUrl = d.UploadedPatternUrl,
                Style = d.Style,
                Placement = d.Placement,
                PrintSize = d.PrintSize,
                Status = d.Status,
                GenerationAttempts = d.GenerationAttempts,
                IsFavorite = d.IsFavorite,
                CreatedAt = d.CreatedDate,
                UpdatedAt = d.UpdatedDate ?? d.CreatedDate,

                UserId = d.UserId
            };
        }
    }
}
