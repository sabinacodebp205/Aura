using Aura.Application.DTOs.AiStudio;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface IAiStudioService
    {
        Task<ChatResponseDto> ProcessChatAsync(ChatRequestDto dto);
        Task<GenerateResponseDto> GenerateGarmentDesignAsync(GenerateRequestDto dto);
        Task<SavedDesignGetDto> SaveDesignAsync(SaveDesignDto dto, Guid? userId);
        Task<List<SavedDesignGetDto>> GetSavedDesignsAsync(Guid userId);
        Task<SavedDesignGetDto?> GetSavedDesignByIdAsync(Guid id);
        Task<SavedDesignGetDto> DuplicateDesignAsync(Guid id, Guid userId);
        Task DeleteSavedDesignAsync(Guid id, Guid userId);
        Task<object> CreateCustomProductAsync(CustomProductCreateDto dto, Guid? userId);
    }
}
