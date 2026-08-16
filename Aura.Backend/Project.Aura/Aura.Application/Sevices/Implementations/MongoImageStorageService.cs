using Aura.Application.Common;
using Aura.Application.DTOs.ImageStorage;
using Aura.Application.Models;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Implementations
{
    public class MongoImageStorageService : IImageStorageService
    {
        private readonly IMongoCollection<ImageDocument> _collection;

        public MongoImageStorageService(IMongoClient mongoClient, IOptions<MongoDbSettings> settings)
        {
            var databaseName = !string.IsNullOrWhiteSpace(settings.Value?.DatabaseName)
                ? settings.Value.DatabaseName
                : "AuraImages";

            var database = mongoClient.GetDatabase(databaseName);
            _collection = database.GetCollection<ImageDocument>("ProductImages");
        }

        public async Task<string> SaveImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new Exception("File is empty.");

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var bytes = memoryStream.ToArray();

            var contentType = !string.IsNullOrWhiteSpace(file.ContentType)
                ? file.ContentType
                : "image/jpeg";

            var document = new ImageDocument
            {
                Id = ObjectId.GenerateNewId(),
                ContentType = contentType,
                Data = bytes,
                UploadedAt = DateTime.UtcNow
            };

            await _collection.InsertOneAsync(document);

            return document.Id.ToString();
        }

        public async Task<ImageResult?> GetImageAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return null;

            var cleanId = ExtractCleanId(id);

            if (!ObjectId.TryParse(cleanId, out var objectId))
                return null;

            var filter = Builders<ImageDocument>.Filter.Eq(x => x.Id, objectId);
            var document = await _collection.Find(filter).FirstOrDefaultAsync();

            if (document == null)
                return null;

            return new ImageResult
            {
                Data = document.Data,
                ContentType = document.ContentType
            };
        }

        public async Task<bool> DeleteImageAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return false;

            var cleanId = ExtractCleanId(id);

            if (!ObjectId.TryParse(cleanId, out var objectId))
                return false;

            var filter = Builders<ImageDocument>.Filter.Eq(x => x.Id, objectId);
            var result = await _collection.DeleteOneAsync(filter);

            return result.DeletedCount > 0;
        }

        private static string ExtractCleanId(string id)
        {
            var trimmed = id.Trim().TrimEnd('/');
            if (trimmed.Contains('/'))
            {
                return trimmed.Split('/').Last();
            }
            return trimmed;
        }
    }
}
