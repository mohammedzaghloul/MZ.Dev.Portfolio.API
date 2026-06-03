using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Link.Dev.Profolie.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddUserResumeUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ResumeUrl",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResumeUrl",
                table: "AspNetUsers");
        }
    }
}
