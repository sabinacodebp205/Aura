using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Aura.Application.Models
{
    public class ImageDocument
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public string ContentType { get; set; } = default!;
        public byte[] Data { get; set; } = default!;
        public DateTime UploadedAt { get; set; }
    }
}
