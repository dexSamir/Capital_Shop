using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Capital.DAL.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedProductImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSecondary",
                table: "Images",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSecondary",
                table: "Images");
        }
    }
}
