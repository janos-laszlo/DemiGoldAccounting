using Microsoft.EntityFrameworkCore.Migrations;

namespace DemiGoldAccountingWebApi.Migrations
{
    public partial class AddHasProfilePictureToClient : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasProfilePicture",
                table: "Clients",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasProfilePicture",
                table: "Clients");
        }
    }
}
