using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Capital.DAL.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductAttribute : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attributes_Products_product_id",
                table: "Attributes");

            migrationBuilder.DropIndex(
                name: "IX_Attributes_Value",
                table: "Attributes");

            migrationBuilder.DropIndex(
                name: "IX_Attributes_isDeleted",
                table: "Attributes");

            migrationBuilder.DropIndex(
                name: "IX_Attributes_isUpdated",
                table: "Attributes");

            migrationBuilder.DropIndex(
                name: "IX_Attributes_name",
                table: "Attributes");

            migrationBuilder.DropIndex(
                name: "IX_Attributes_product_id",
                table: "Attributes");

            migrationBuilder.DropIndex(
                name: "IX_Attributes_product_id_name",
                table: "Attributes");

            migrationBuilder.DropColumn(
                name: "Value",
                table: "Attributes");

            migrationBuilder.DropColumn(
                name: "product_id",
                table: "Attributes");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Attributes",
                newName: "Name");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Attributes",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(100)");

            migrationBuilder.AlterColumn<bool>(
                name: "isUpdated",
                table: "Attributes",
                type: "boolean",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "isDeleted",
                table: "Attributes",
                type: "boolean",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldDefaultValue: false);

            migrationBuilder.CreateTable(
                name: "AttributeValues",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Value = table.Column<string>(type: "text", nullable: false),
                    AttributeId = table.Column<int>(type: "integer", nullable: false),
                    CreatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    isDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    isUpdated = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttributeValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AttributeValues_Attributes_AttributeId",
                        column: x => x.AttributeId,
                        principalTable: "Attributes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductAttributeValues",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProductId = table.Column<int>(type: "integer", nullable: false),
                    AttributeValueId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductAttributeValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductAttributeValues_AttributeValues_AttributeValueId",
                        column: x => x.AttributeValueId,
                        principalTable: "AttributeValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductAttributeValues_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AttributeValues_AttributeId",
                table: "AttributeValues",
                column: "AttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductAttributeValues_AttributeValueId",
                table: "ProductAttributeValues",
                column: "AttributeValueId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductAttributeValues_ProductId",
                table: "ProductAttributeValues",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductAttributeValues");

            migrationBuilder.DropTable(
                name: "AttributeValues");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Attributes",
                newName: "name");

            migrationBuilder.AlterColumn<bool>(
                name: "isUpdated",
                table: "Attributes",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<bool>(
                name: "isDeleted",
                table: "Attributes",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "Attributes",
                type: "varchar(100)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "Value",
                table: "Attributes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "product_id",
                table: "Attributes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Attributes_Value",
                table: "Attributes",
                column: "Value");

            migrationBuilder.CreateIndex(
                name: "IX_Attributes_isDeleted",
                table: "Attributes",
                column: "isDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Attributes_isUpdated",
                table: "Attributes",
                column: "isUpdated");

            migrationBuilder.CreateIndex(
                name: "IX_Attributes_name",
                table: "Attributes",
                column: "name");

            migrationBuilder.CreateIndex(
                name: "IX_Attributes_product_id",
                table: "Attributes",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_Attributes_product_id_name",
                table: "Attributes",
                columns: new[] { "product_id", "name" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Attributes_Products_product_id",
                table: "Attributes",
                column: "product_id",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
