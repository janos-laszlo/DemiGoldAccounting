using Microsoft.EntityFrameworkCore.Migrations;

namespace DemiGoldAccountingWebApi.Migrations
{
    public partial class AddHasProfilePictureToEmployee : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasProfilePicture",
                table: "Employees",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasProfilePicture",
                table: "Employees");
        }
    }
}
