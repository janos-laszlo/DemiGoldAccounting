using Microsoft.EntityFrameworkCore.Migrations;

namespace DemiGoldAccountingWebApi.Migrations
{
    public partial class AddDisplayIndexToTransactionType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DisplayIndex",
                table: "TransactionTypes",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisplayIndex",
                table: "TransactionTypes");
        }
    }
}
