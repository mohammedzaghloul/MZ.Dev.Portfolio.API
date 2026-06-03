using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Link.Dev.Profolie.DAL.Migrations
{
    /// <inheritdoc />
    public partial class UpdateExperienceDatesToDateOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Clean up and format existing date strings to prevent migration conversion errors
            migrationBuilder.Sql("UPDATE Experiences SET EndDate = NULL WHERE EndDate = 'Present' OR TRIM(EndDate) = '';");
            migrationBuilder.Sql("UPDATE Experiences SET StartDate = StartDate + '-01' WHERE LEN(StartDate) = 7 AND StartDate LIKE '[0-9][0-9][0-9][0-9]-[0-9][0-9]';");
            migrationBuilder.Sql("UPDATE Experiences SET EndDate = EndDate + '-01' WHERE LEN(EndDate) = 7 AND EndDate LIKE '[0-9][0-9][0-9][0-9]-[0-9][0-9]';");
            migrationBuilder.Sql("UPDATE Experiences SET StartDate = '2000-01-01' WHERE ISDATE(StartDate) = 0;");
            migrationBuilder.Sql("UPDATE Experiences SET EndDate = NULL WHERE EndDate IS NOT NULL AND ISDATE(EndDate) = 0;");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "StartDate",
                table: "Experiences",
                type: "date",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "EndDate",
                table: "Experiences",
                type: "date",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "StartDate",
                table: "Experiences",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.AlterColumn<string>(
                name: "EndDate",
                table: "Experiences",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);
        }
    }
}
