using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Aura.Application.DTOs.Chat;
using Aura.Application.Sevices.Implementations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Primitives;
using Xunit;

namespace Aura.Tests
{
    public class MockConfiguration : IConfiguration
    {
        private readonly Dictionary<string, string?> _values = new();

        public string? this[string key]
        {
            get => _values.TryGetValue(key, out var val) ? val : null;
            set => _values[key] = value;
        }

        public IEnumerable<IConfigurationSection> GetChildren() => Array.Empty<IConfigurationSection>();
        public IChangeToken GetReloadToken() => throw new NotImplementedException();
        public IConfigurationSection GetSection(string key) => null!;
    }

    public class ChatServiceTests
    {
        private readonly ChatService _chatService;

        public ChatServiceTests()
        {
            var config = new MockConfiguration();
            _chatService = new ChatService(config, NullLogger<ChatService>.Instance);
        }

        [Fact]
        public async Task ProcessMessageAsync_SizingQuery_ReturnsSizingInformation()
        {
            var request = new ChatRequestDto
            {
                Message = "Can you help me with sizing for hoodies?"
            };

            var response = await _chatService.ProcessMessageAsync(request);

            Assert.NotNull(response);
            Assert.Contains("Sizing Guide", response.Reply, StringComparison.OrdinalIgnoreCase);
            Assert.NotEmpty(response.ConversationId);
        }

        [Fact]
        public async Task ProcessMessageAsync_ShippingQuery_ReturnsShippingPolicy()
        {
            var request = new ChatRequestDto
            {
                Message = "How long does shipping take?"
            };

            var response = await _chatService.ProcessMessageAsync(request);

            Assert.NotNull(response);
            Assert.Contains("Shipping", response.Reply, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task ProcessMessageAsync_ReturnQuery_ReturnsReturnPolicy()
        {
            var request = new ChatRequestDto
            {
                Message = "What is your return policy?"
            };

            var response = await _chatService.ProcessMessageAsync(request);

            Assert.NotNull(response);
            Assert.Contains("Returns", response.Reply, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task ProcessMessageAsync_GeneralGreeting_ReturnsConciergeWelcome()
        {
            var request = new ChatRequestDto
            {
                Message = "Hello!"
            };

            var response = await _chatService.ProcessMessageAsync(request);

            Assert.NotNull(response);
            Assert.Contains("Concierge", response.Reply, StringComparison.OrdinalIgnoreCase);
            Assert.NotNull(response.SuggestedFollowUps);
            Assert.NotEmpty(response.SuggestedFollowUps);
        }
    }
}
