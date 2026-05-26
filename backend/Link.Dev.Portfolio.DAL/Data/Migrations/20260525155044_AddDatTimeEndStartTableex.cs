using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Link.Dev.Profolie.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddDatTimeEndStartTableex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateRange",
                table: "Experiences");

            migrationBuilder.AddColumn<string>(
                name: "EndDate",
                table: "Experiences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StartDate",
                table: "Experiences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Experiences");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Experiences");

            migrationBuilder.AddColumn<string>(
                name: "DateRange",
                table: "Experiences",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
