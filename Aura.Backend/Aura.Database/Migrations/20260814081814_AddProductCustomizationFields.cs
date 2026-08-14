using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aura.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddProductCustomizationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Designs_AspNetUsers_UserId",
                table: "Designs");

            migrationBuilder.DropForeignKey(
                name: "FK_Designs_Products_ProductId",
                table: "Designs");

            migrationBuilder.AddColumn<decimal>(
                name: "CustomizationFee",
                table: "Products",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProductType",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "SourceDesignId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Designs",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "Prompt",
                table: "Designs",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AlterColumn<Guid>(
                name: "ProductId",
                table: "Designs",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Designs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GarmentType",
                table: "Designs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "GenerationAttempts",
                table: "Designs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsFavorite",
                table: "Designs",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Designs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Placement",
                table: "Designs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrintSize",
                table: "Designs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Designs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Style",
                table: "Designs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UploadedPatternUrl",
                table: "Designs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Designs_AspNetUsers_UserId",
                table: "Designs",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Designs_Products_ProductId",
                table: "Designs",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Designs_AspNetUsers_UserId",
                table: "Designs");

            migrationBuilder.DropForeignKey(
                name: "FK_Designs_Products_ProductId",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "CustomizationFee",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProductType",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SourceDesignId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Color",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "GarmentType",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "GenerationAttempts",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "IsFavorite",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "Placement",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "PrintSize",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "Style",
                table: "Designs");

            migrationBuilder.DropColumn(
                name: "UploadedPatternUrl",
                table: "Designs");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Designs",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Prompt",
                table: "Designs",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "ProductId",
                table: "Designs",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Designs_AspNetUsers_UserId",
                table: "Designs",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Designs_Products_ProductId",
                table: "Designs",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
