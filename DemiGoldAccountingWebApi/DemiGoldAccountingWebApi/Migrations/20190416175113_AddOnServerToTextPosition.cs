using Microsoft.EntityFrameworkCore.Migrations;

namespace DemiGoldAccountingWebApi.Migrations
{
    public partial class AddOnServerToTextPosition : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "OnServer",
                table: "TextPositions",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OnServer",
                table: "TextPositions");
        }
    }
}
