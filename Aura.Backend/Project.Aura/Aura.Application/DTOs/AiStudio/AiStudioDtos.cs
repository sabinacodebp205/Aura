using System;
using System.Collections.Generic;

namespace Aura.Application.DTOs.AiStudio
{
    public class CanvasActionsDto
    {
        public string? Placement { get; set; }
        public double? Scale { get; set; }
        public double? Rotation { get; set; }
        public double? PositionX { get; set; }
        public double? PositionY { get; set; }
        public string? GarmentType { get; set; }
        public string? Color { get; set; }
        public string? AddedText { get; set; }
        public string? Mode { get; set; }
    }

    public class DesignSpecDto
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? ProductId { get; set; }
        public string? ProductName { get; set; }
        public string GarmentType { get; set; } = "hoodie";
        public string Color { get; set; } = "black";
        public string? Prompt { get; set; }
        public string? UploadedPatternUrl { get; set; }
        public string? Style { get; set; }
        public string? Placement { get; set; }
        public string? PrintSize { get; set; }
        public double? Scale { get; set; } = 100;
        public double? Rotation { get; set; } = 0;
        public double? PositionX { get; set; } = 50;
        public double? PositionY { get; set; } = 48;
        public string Status { get; set; } = "draft";
        public string? GeneratedImageUrl { get; set; }
        public int GenerationAttempts { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public Guid? UserId { get; set; }
    }

    public class ChatRequestDto
    {
        public string ConversationId { get; set; } = string.Empty;
        public string UserMessage { get; set; } = string.Empty;
        public DesignSpecDto CurrentSpec { get; set; } = new DesignSpecDto();
    }

    public class ChatResponseDto
    {
        public string Reply { get; set; } = string.Empty;
        public CanvasActionsDto? CanvasActions { get; set; }
        public DesignSpecDto UpdatedSpec { get; set; } = new DesignSpecDto();
        public bool NeedsClarification { get; set; } = false;
        public List<string>? SuggestedOptions { get; set; }
    }

    public class GenerateRequestDto
    {
        public DesignSpecDto Spec { get; set; } = new DesignSpecDto();
    }

    public class GenerateResponseDto
    {
        public string GeneratedImageUrl { get; set; } = string.Empty;
        public string GenerationId { get; set; } = Guid.NewGuid().ToString();
        public string Status { get; set; } = "success"; // success | failed
        public string? ErrorReason { get; set; }
    }

    public class SaveDesignDto
    {
        public DesignSpecDto Spec { get; set; } = new DesignSpecDto();
        public string? Name { get; set; }
    }

    public class SavedDesignGetDto : DesignSpecDto
    {
        public string Name { get; set; } = "Custom Design";
        public bool IsFavorite { get; set; } = false;
    }

    public class CustomProductCreateDto
    {
        public string SourceDesignId { get; set; } = string.Empty;
        public string GarmentType { get; set; } = "hoodie";
        public string Color { get; set; } = "black";
        public string? Size { get; set; } = "M";
        public string GeneratedImageUrl { get; set; } = string.Empty;
        public decimal BasePrice { get; set; } = 124.00m;
        public decimal CustomizationFee { get; set; } = 15.00m;
    }
}
