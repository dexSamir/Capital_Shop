using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Capital.DAL.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductAttributeValue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedTime",
                table: "ProductAttributeValues",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedTime",
                table: "ProductAttributeValues",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isDeleted",
                table: "ProductAttributeValues",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "isUpdated",
                table: "ProductAttributeValues",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedTime",
                table: "ProductAttributeValues");

            migrationBuilder.DropColumn(
                name: "UpdatedTime",
                table: "ProductAttributeValues");

            migrationBuilder.DropColumn(
                name: "isDeleted",
                table: "ProductAttributeValues");

            migrationBuilder.DropColumn(
                name: "isUpdated",
                table: "ProductAttributeValues");
        }
    }
}
