using System;
using System.Collections.Generic;

namespace Aura.Application.DTOs.Chat
{
    public class ChatMessageDto
    {
        public string Role { get; set; } = "user"; // user | assistant | system
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    public class ChatRequestDto
    {
        public string? ConversationId { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<ChatMessageDto>? History { get; set; }
    }

    public class ChatResponseDto
    {
        public string Reply { get; set; } = string.Empty;
        public string ConversationId { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public List<string>? SuggestedFollowUps { get; set; }
    }
}
