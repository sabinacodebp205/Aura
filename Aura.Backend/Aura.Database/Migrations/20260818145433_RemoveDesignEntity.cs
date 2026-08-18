using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aura.Database.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDesignEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Designs_DesignId",
                table: "OrderItems");

            migrationBuilder.DropTable(
                name: "Designs");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_DesignId",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "CustomizationFee",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsCustomizable",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SourceDesignId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "DesignId",
                table: "OrderItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CustomizationFee",
                table: "Products",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsCustomizable",
                table: "Products",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "SourceDesignId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DesignId",
                table: "OrderItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Designs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExtraPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    GarmentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GenerationAttempts = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsFavorite = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Placement = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrintSize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Prompt = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Style = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UploadedPatternUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Designs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Designs_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Designs_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_DesignId",
                table: "OrderItems",
                column: "DesignId");

            migrationBuilder.CreateIndex(
                name: "IX_Designs_ProductId",
                table: "Designs",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Designs_UserId",
                table: "Designs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Designs_DesignId",
                table: "OrderItems",
                column: "DesignId",
                principalTable: "Designs",
                principalColumn: "Id");
        }
    }
}
