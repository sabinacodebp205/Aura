using Aura.Application.DTOs.AiStudio;
using Aura.Application.Sevices.Interfaces;
using Aura.Core.Entities;
using Aura.Core.Enums;
using Aura.Core.Interfaces.Repositories;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Implementations
{
    public class AiStudioService : IAiStudioService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AiStudioService> _logger;
        private static readonly HttpClient _httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(35) };

        private static readonly string[] ProhibitedKeywords = new[]
        {
            "hate", "violence", "explicit", "nude", "illegal", "toxic", "offensive"
        };

        private static readonly Dictionary<string, string> BaseGarmentImages = new(StringComparer.OrdinalIgnoreCase)
        {
            { "tshirt", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85" },
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

        public AiStudioService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IConfiguration configuration,
            ILogger<AiStudioService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<ChatResponseDto> ProcessChatAsync(ChatRequestDto dto)
        {
            var userMessage = dto.UserMessage?.Trim() ?? string.Empty;
            var currentSpec = dto.CurrentSpec ?? new DesignSpecDto();
            currentSpec.UpdatedAt = DateTime.UtcNow;

            var apiKey = _configuration["AiService:ApiKey"]
                ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY")
                ?? string.Empty;
            var modelName = _configuration["AiService:Model"] ?? "gemini-2.0-flash";

            if (!string.IsNullOrWhiteSpace(apiKey))
            {
                try
                {
                    var response = await CallGeminiApiAsync(apiKey, modelName, userMessage, currentSpec);
                    if (response != null)
                    {
                        return response;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[AiStudioService] Error calling Gemini API. Falling back to local assistant reasoning.");
                }
            }
            else
            {
                _logger.LogWarning("[AiStudioService] Gemini API Key is not configured in 'AiService:ApiKey'. Operating in smart local fallback mode.");
            }

            return ProcessLocalChatFallback(userMessage, currentSpec);
        }

        private async Task<ChatResponseDto?> CallGeminiApiAsync(
            string apiKey,
            string modelName,
            string userMessage,
            DesignSpecDto spec)
        {
            var systemPrompt = @"You are the AURA AI Designer and Luxury Fashion Concierge.
You assist customers inside the AURA AI Customization Studio.

AURA KNOWLEDGE BASE:
- Silhouettes: Studio Oversized Hoodie ($124 base), Signature Canvas Tee ($58 base), Crewneck Sweatshirt ($108 base), Sculpted Utility Jacket ($188 base), Neo Bomber ($172 base), Ribbed Tank Top ($44 base), Silk Blouse ($138 base).
- Sizing: XS, S, M, L, XL (tailored architectural streetwear fit).
- Fabrics: 420 GSM heavyweight brushed French terry cotton (hoodie), 240 GSM organic combed cotton (tees).
- Curated Colors: deep black, pure white, heather grey, natural beige, charcoal, midnight navy, muted olive, vanilla cream.
- Placement Zones: center (Center Front), left_chest (Discreet brand mark), right_chest, upper (Upper Chest), middle, lower (Lower Hem), back (Full Back Statement), custom.
- Scales: 20% to 180% (standard 100%).
- Rotations: -180 to 180 deg (standard 0).
- Pricing & Fees: Base garment price + $15.00 flat AI Customization Fee.
- Studio Workflow: Step 1 (Upload Design) -> Step 2 (Position) -> Step 3 (AI Customize) -> Step 4 (Render Mockup) -> Step 5 (Save/Buy).

DUAL ROLE INSTRUCTIONS:
1. DESIGN MUTATIONS: When the user asks to move, resize, rotate, restyle, change garment/color, or add text, mutate the canvasActions and updatedSpec accordingly, and confirm the change in plain, elegant language.
2. APP Q&A: When the user asks general questions about sizing, fabrics, shipping, saving designs, pricing, or the studio process, answer thoroughly and conversationally in markdown.

OUTPUT FORMAT REQUIREMENTS:
You MUST respond with a single, valid JSON object with this exact shape:
{
  ""reply"": ""Conversational response acknowledging changes or answering user questions."",
  ""canvasActions"": {
    ""placement"": ""center"" | ""left_chest"" | ""right_chest"" | ""upper"" | ""middle"" | ""lower"" | ""back"" | ""custom"" | null,
    ""scale"": 100,
    ""rotation"": 0,
    ""garmentType"": ""hoodie"" | ""tshirt"" | ""sweatshirt"" | ""jacket"" | null,
    ""color"": ""black"" | ""white"" | ""grey"" | ""beige"" | ""charcoal"" | ""navy"" | ""olive"" | ""cream"" | null,
    ""addedText"": ""string or null"",
    ""mode"": ""print"" | ""embroidery"" | null
  },
  ""updatedSpec"": {
    ""garmentType"": ""hoodie"",
    ""color"": ""black"",
    ""style"": ""minimal"",
    ""placement"": ""center"",
    ""printSize"": ""medium"",
    ""prompt"": ""prompt text""
  },
  ""suggestedOptions"": [""Option 1"", ""Option 2"", ""Option 3""]
}";

            var currentContextSummary = $"CURRENT DESIGN CONTEXT: Garment={spec.GarmentType}, Color={spec.Color}, Placement={spec.Placement ?? "center"}, Scale={spec.PrintSize ?? "medium"}, Style={spec.Style ?? "custom"}, HasUploadedPattern={(string.IsNullOrWhiteSpace(spec.UploadedPatternUrl) ? "No" : "Yes (PNG uploaded)")}. User Prompt/History: {spec.Prompt ?? "None"}";

            var model = string.IsNullOrWhiteSpace(modelName) ? "gemini-2.0-flash" : modelName;
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

            var requestBody = new
            {
                system_instruction = new
                {
                    parts = new[] { new { text = systemPrompt } }
                },
                contents = new[]
                {
                    new
                    {
                        role = "user",
                        parts = new[] { new { text = $"{currentContextSummary}\n\nUser Request: {userMessage}" } }
                    }
                },
                generationConfig = new
                {
                    response_mime_type = "application/json",
                    temperature = 0.4
                }
            };

            var jsonPayload = JsonSerializer.Serialize(requestBody);
            using var request = new HttpRequestMessage(HttpMethod.Post, url);
            request.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var httpResponse = await _httpClient.SendAsync(request);
            if (!httpResponse.IsSuccessStatusCode)
            {
                var errContent = await httpResponse.Content.ReadAsStringAsync();
                _logger.LogError("[AiStudioService] Gemini API returned {StatusCode}: {Error}", httpResponse.StatusCode, errContent);
                return null;
            }

            var responseJson = await httpResponse.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseJson);
            var candidates = doc.RootElement.GetProperty("candidates");
            if (candidates.GetArrayLength() == 0) return null;

            var parts = candidates[0].GetProperty("content").GetProperty("parts");
            if (parts.GetArrayLength() == 0) return null;

            var rawText = parts[0].GetProperty("text").GetString() ?? string.Empty;

            var cleanedJson = rawText.Trim();
            if (cleanedJson.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
            {
                cleanedJson = cleanedJson.Substring(7);
            }
            else if (cleanedJson.StartsWith("```"))
            {
                cleanedJson = cleanedJson.Substring(3);
            }
            if (cleanedJson.EndsWith("```"))
            {
                cleanedJson = cleanedJson.Substring(0, cleanedJson.Length - 3);
            }
            cleanedJson = cleanedJson.Trim();

            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var parsed = JsonSerializer.Deserialize<ChatResponseDto>(cleanedJson, options);
                if (parsed != null)
                {
                    if (parsed.UpdatedSpec == null) parsed.UpdatedSpec = spec;
                    parsed.UpdatedSpec.UpdatedAt = DateTime.UtcNow;
                    return parsed;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "[AiStudioService] Could not parse Gemini JSON response. Using raw text as reply.");
                return new ChatResponseDto
                {
                    Reply = rawText,
                    UpdatedSpec = spec,
                    SuggestedOptions = new List<string> { "Center placement", "Left chest", "Make smaller", "Save design" }
                };
            }

            return null;
        }

        private static ChatResponseDto ProcessLocalChatFallback(string userMessage, DesignSpecDto currentSpec)
        {
            var msg = userMessage.ToLowerInvariant();
            var actions = new CanvasActionsDto();

            if (msg.Contains("left chest"))
            {
                currentSpec.Placement = "left_chest";
                actions.Placement = "left_chest";
                actions.Scale = 48;
            }
            else if (msg.Contains("right chest"))
            {
                currentSpec.Placement = "right_chest";
                actions.Placement = "right_chest";
                actions.Scale = 48;
            }
            else if (msg.Contains("center") || msg.Contains("front"))
            {
                currentSpec.Placement = "center";
                actions.Placement = "center";
                actions.Scale = 100;
            }
            else if (msg.Contains("back"))
            {
                currentSpec.Placement = "back";
                actions.Placement = "back";
                actions.Scale = 110;
            }

            if (msg.Contains("smaller") || msg.Contains("small"))
            {
                actions.Scale = 50;
                currentSpec.PrintSize = "small";
            }
            else if (msg.Contains("larger") || msg.Contains("bigger") || msg.Contains("oversized"))
            {
                actions.Scale = 135;
                currentSpec.PrintSize = "large";
            }

            if (msg.Contains("black")) { currentSpec.Color = "black"; actions.Color = "black"; }
            else if (msg.Contains("white")) { currentSpec.Color = "white"; actions.Color = "white"; }
            else if (msg.Contains("grey") || msg.Contains("gray")) { currentSpec.Color = "grey"; actions.Color = "grey"; }

            if (msg.Contains("hoodie")) { currentSpec.GarmentType = "hoodie"; actions.GarmentType = "hoodie"; }
            else if (msg.Contains("tshirt") || msg.Contains("t-shirt") || msg.Contains("tee")) { currentSpec.GarmentType = "tshirt"; actions.GarmentType = "tshirt"; }

            if (msg.Contains("embroidery")) { actions.Mode = "embroidery"; currentSpec.Style = "embroidery"; }
            else if (msg.Contains("print")) { actions.Mode = "print"; currentSpec.Style = "print"; }

            // General Q&A detection
            string reply;
            if (msg.Contains("size") || msg.Contains("sizing") || msg.Contains("fit"))
            {
                reply = "AURA garments feature a relaxed, tailored streetwear silhouette available in sizes XS through XL. Each piece is engineered with drop-shoulder ergonomics for a clean architectural drape.";
            }
            else if (msg.Contains("fabric") || msg.Contains("material") || msg.Contains("gsm"))
            {
                reply = "Our hoodies are crafted from custom-milled 420 GSM brushed French terry cotton with double-layer ribbing. Our tees use 240 GSM organic combed cotton for substantial luxury weight.";
            }
            else if (msg.Contains("placement") || msg.Contains("position"))
            {
                reply = "You can position your design across 8 zones: Center Front, Left Chest, Right Chest, Upper Collar, Mid Torso, Lower Hem, Full Back, or freeform dragging on the canvas.";
            }
            else if (msg.Contains("price") || msg.Contains("cost") || msg.Contains("fee"))
            {
                reply = "Customized pieces include the base garment price plus a flat $15.00 AI Customization Fee for high-resolution vector pre-press and textile formulation.";
            }
            else if (msg.Contains("save") || msg.Contains("profile"))
            {
                reply = "When you complete your design in Step 5, click 'Save Design to My Profile'. You can revisit, re-order, or edit your saved designs anytime under Profile → My AI Designs.";
            }
            else
            {
                reply = $"I've updated your design on the {currentSpec.Color} {currentSpec.GarmentType.Replace('_', ' ')}. You can adjust placement, scale, or ask about our fabrics and sizing.";
            }

            return new ChatResponseDto
            {
                Reply = reply,
                CanvasActions = actions,
                UpdatedSpec = currentSpec,
                SuggestedOptions = new List<string> { "Center placement", "Left chest", "Make smaller", "Tell me about fabrics" }
            };
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
