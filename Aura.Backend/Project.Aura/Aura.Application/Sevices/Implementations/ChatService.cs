using Aura.Application.DTOs.Chat;
using Aura.Application.Sevices.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Implementations
{
    public class ChatService : IChatService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ChatService> _logger;
        private static readonly HttpClient _httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(25) };

        public ChatService(IConfiguration configuration, ILogger<ChatService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<ChatResponseDto> ProcessMessageAsync(ChatRequestDto dto)
        {
            var conversationId = string.IsNullOrWhiteSpace(dto.ConversationId)
                ? Guid.NewGuid().ToString()
                : dto.ConversationId;

            var userMessage = dto.Message?.Trim() ?? string.Empty;

            var apiKey = _configuration["AiService:ApiKey"]
                ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY")
                ?? string.Empty;
            var modelName = _configuration["AiService:Model"] ?? "gemini-2.0-flash";

            if (!string.IsNullOrWhiteSpace(apiKey))
            {
                try
                {
                    var result = await CallGeminiApiAsync(apiKey, modelName, userMessage, dto.History, conversationId);
                    if (result != null)
                    {
                        return result;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "[ChatService] Error calling Gemini API. Falling back to local shopping concierge.");
                }
            }
            else
            {
                _logger.LogInformation("[ChatService] Gemini API key not set. Using smart local shopping concierge response.");
            }

            return ProcessLocalAssistantFallback(userMessage, conversationId);
        }

        private async Task<ChatResponseDto?> CallGeminiApiAsync(
            string apiKey,
            string modelName,
            string userMessage,
            List<ChatMessageDto>? history,
            string conversationId)
        {
            var systemPrompt = @"You are AURA Concierge — an AI personal shopping assistant for AURA, a high-end architectural fashion and modern streetwear e-commerce brand.

YOUR ROLE & TONE:
- Elegant, concise, knowledgeable, warm, and helpful.
- Assist customers with product recommendations, sizing questions, material details, shipping, returns, order questions, and styling advice.
- Keep responses conversational, concise (2-4 paragraphs max or bulleted), and formatted in clean markdown.

BRAND INFORMATION:
- Products: Luxury hoodies, signature organic cotton tees, crewneck sweatshirts, sculpted jackets, oversized cargo pants, minimalist knitwear, and modern accessories.
- Fabrics & Craftsmanship: 420 GSM heavyweight brushed French terry cotton (hoodies), 240 GSM organic combed cotton (tees), bespoke garment dyeing, reinforced double-needle stitching.
- Sizing: XS, S, M, L, XL with a tailored architectural streetwear silhouette (slightly relaxed with clean shoulder drape). If between sizes, recommend sizing down for a fitted look or true-to-size for the intended relaxed fit.
- Shipping: Free standard shipping worldwide on orders over $100. Standard delivery takes 3-5 business days. Express shipping (1-2 days) is available at checkout.
- Returns & Exchanges: 30-day hassle-free returns on all unworn items with original tags. Free exchanges.
- Support: Available 24/7. Users can also view their active orders in their Profile tab.

OUTPUT FORMAT:
Respond with a single valid JSON object in this exact format:
{
  ""reply"": ""Your formatted markdown response to the customer."",
  ""suggestedFollowUps"": [""Option 1"", ""Option 2"", ""Option 3""]
}";

            var contents = new List<object>();

            // Add history if present
            if (history != null && history.Any())
            {
                foreach (var msg in history.TakeLast(6))
                {
                    var role = msg.Role.Equals("assistant", StringComparison.OrdinalIgnoreCase) ? "model" : "user";
                    contents.Add(new
                    {
                        role = role,
                        parts = new[] { new { text = msg.Content } }
                    });
                }
            }

            contents.Add(new
            {
                role = "user",
                parts = new[] { new { text = userMessage } }
            });

            var model = string.IsNullOrWhiteSpace(modelName) ? "gemini-2.0-flash" : modelName;
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

            var requestBody = new
            {
                system_instruction = new
                {
                    parts = new[] { new { text = systemPrompt } }
                },
                contents = contents,
                generationConfig = new
                {
                    response_mime_type = "application/json",
                    temperature = 0.5
                }
            };

            var jsonPayload = JsonSerializer.Serialize(requestBody);
            using var request = new HttpRequestMessage(HttpMethod.Post, url);
            request.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var httpResponse = await _httpClient.SendAsync(request);
            if (!httpResponse.IsSuccessStatusCode)
            {
                var errContent = await httpResponse.Content.ReadAsStringAsync();
                _logger.LogError("[ChatService] Gemini API returned {StatusCode}: {Error}", httpResponse.StatusCode, errContent);
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
                var parsed = JsonSerializer.Deserialize<GeminiAssistantPayload>(cleanedJson, options);
                if (parsed != null && !string.IsNullOrWhiteSpace(parsed.Reply))
                {
                    return new ChatResponseDto
                    {
                        Reply = parsed.Reply,
                        ConversationId = conversationId,
                        Timestamp = DateTime.UtcNow,
                        SuggestedFollowUps = parsed.SuggestedFollowUps ?? new List<string> { "What is your sizing guide?", "How does shipping work?", "Tell me about fabric quality" }
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "[ChatService] Could not deserialize Gemini JSON. Returning raw text.");
            }

            return new ChatResponseDto
            {
                Reply = rawText,
                ConversationId = conversationId,
                Timestamp = DateTime.UtcNow,
                SuggestedFollowUps = new List<string> { "What is your sizing guide?", "How does shipping work?", "Explore hoodies" }
            };
        }

        private static ChatResponseDto ProcessLocalAssistantFallback(string userMessage, string conversationId)
        {
            var msg = userMessage.ToLowerInvariant();
            string reply;
            var followUps = new List<string>();

            if (msg.Contains("size") || msg.Contains("sizing") || msg.Contains("fit") || msg.Contains("measurement"))
            {
                reply = "### AURA Sizing Guide\n\nOur garments are cut with an **architectural streetwear fit** — slightly relaxed with structured drop-shoulders.\n\n- **XS – S**: Tailored modern slim fit.\n- **M – L**: Signature relaxed streetwear drape.\n- **XL**: Generous oversized silhouette.\n\n*Tip: If you prefer a tailored look, take your usual size. For a bold streetwear drape, size up.*";
                followUps = new List<string> { "Tell me about fabric quality", "What is your return policy?", "Show bestsellers" };
            }
            else if (msg.Contains("shipping") || msg.Contains("delivery") || msg.Contains("arrive") || msg.Contains("tracking"))
            {
                reply = "### Shipping & Delivery\n\n- **Standard Delivery**: 3–5 business days (Free on orders over $100).\n- **Express Delivery**: 1–2 business days ($15 flat rate).\n- **Order Tracking**: Real-time status updates are available under your **Profile → Orders** section as soon as your package ships.";
                followUps = new List<string> { "What is your return policy?", "How do I contact support?", "What is your sizing guide?" };
            }
            else if (msg.Contains("return") || msg.Contains("refund") || msg.Contains("exchange"))
            {
                reply = "### Hassle-Free Returns\n\nWe offer **30-day complimentary returns and exchanges** on all unworn items in original condition with tags attached. You can initiate a return directly from your account profile or contact our concierge.";
                followUps = new List<string> { "How does shipping work?", "What is your sizing guide?", "Explore collection" };
            }
            else if (msg.Contains("fabric") || msg.Contains("material") || msg.Contains("quality") || msg.Contains("gsm") || msg.Contains("cotton"))
            {
                reply = "### Material & Craftsmanship\n\n- **Studio Hoodies**: Crafted from custom-milled **420 GSM heavyweight brushed French terry cotton** with double-layer ribbing.\n- **Canvas Tees**: Made from **240 GSM organic combed cotton** with reinforced necklines.\n- **Care**: Machine wash cold on gentle cycle and hang dry to preserve fabric luster.";
                followUps = new List<string> { "What is your sizing guide?", "How does shipping work?", "Show popular hoodies" };
            }
            else if (msg.Contains("hoodie") || msg.Contains("jacket") || msg.Contains("tee") || msg.Contains("product") || msg.Contains("recommend") || msg.Contains("popular"))
            {
                reply = "### Featured Collection\n\nOur current highlights include:\n1. **Studio Oversized Hoodie** — 420 GSM heavyweight drape ($124.00)\n2. **Signature Canvas Tee** — 240 GSM organic combed cotton ($58.00)\n3. **Sculpted Utility Jacket** — Architectural tailored streetwear ($188.00)\n\nFeel free to explore our full catalog on the home page!";
                followUps = new List<string> { "What is your sizing guide?", "How does shipping work?", "Tell me about fabric quality" };
            }
            else
            {
                reply = "Hello! I'm your **AURA Shopping Concierge**. I can help you find the right size, learn about our luxury fabrics and garments, check shipping policies, or provide styling recommendations. How can I assist you today?";
                followUps = new List<string> { "Sizing Guide", "Fabric & Quality Details", "Shipping & Delivery", "Return Policy" };
            }

            return new ChatResponseDto
            {
                Reply = reply,
                ConversationId = conversationId,
                Timestamp = DateTime.UtcNow,
                SuggestedFollowUps = followUps
            };
        }

        private class GeminiAssistantPayload
        {
            public string? Reply { get; set; }
            public List<string>? SuggestedFollowUps { get; set; }
        }
    }
}
