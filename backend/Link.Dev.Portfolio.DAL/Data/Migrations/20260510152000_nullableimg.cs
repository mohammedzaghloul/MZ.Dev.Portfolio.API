using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Link.Dev.Profolie.DAL.Migrations
{
    /// <inheritdoc />
    public partial class nullableimg : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_contacts_AspNetUsers_UserId",
                table: "contacts");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjeProjectSkills_Projects_ProjectId",
                table: "ProjeProjectSkills");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjeProjectSkills_Skills_SkillId",
                table: "ProjeProjectSkills");

            migrationBuilder.DropPrimaryKey(
                name: "PK_contacts",
                table: "contacts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjeProjectSkills",
                table: "ProjeProjectSkills");

            migrationBuilder.DropIndex(
                name: "IX_ProjeProjectSkills_ProjectId",
                table: "ProjeProjectSkills");

            migrationBuilder.DropColumn(
                name: "Fnstagram",
                table: "contacts");

            migrationBuilder.RenameTable(
                name: "contacts",
                newName: "Contacts");

            migrationBuilder.RenameTable(
                name: "ProjeProjectSkills",
                newName: "ProjectSkills");

            migrationBuilder.RenameIndex(
                name: "IX_contacts_UserId",
                table: "Contacts",
                newName: "IX_Contacts_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_ProjeProjectSkills_SkillId",
                table: "ProjectSkills",
                newName: "IX_ProjectSkills_SkillId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Skills",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Skills",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "Skills",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Skills",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "LastModifiedBy",
                table: "Skills",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModifiedOn",
                table: "Skills",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Projects",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Image",
                table: "Projects",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Projects",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Projects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "Projects",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Projects",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "LastModifiedBy",
                table: "Projects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModifiedOn",
                table: "Projects",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "TikTok",
                table: "Contacts",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Linkedin",
                table: "Contacts",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Github",
                table: "Contacts",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Facebook",
                table: "Contacts",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Contacts",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Contacts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "Contacts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Instagram",
                table: "Contacts",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Contacts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "LastModifiedBy",
                table: "Contacts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModifiedOn",
                table: "Contacts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "AspNetUsers",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "About",
                table: "AspNetUsers",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "ProjectSkills",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedOn",
                table: "ProjectSkills",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "ProjectSkills",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "LastModifiedBy",
                table: "ProjectSkills",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModifiedOn",
                table: "ProjectSkills",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Contacts",
                table: "Contacts",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectSkills",
                table: "ProjectSkills",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectSkills_ProjectId_SkillId",
                table: "ProjectSkills",
                columns: new[] { "ProjectId", "SkillId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Contacts_AspNetUsers_UserId",
                table: "Contacts",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectSkills_Projects_ProjectId",
                table: "ProjectSkills",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectSkills_Skills_SkillId",
                table: "ProjectSkills",
                column: "SkillId",
                principalTable: "Skills",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contacts_AspNetUsers_UserId",
                table: "Contacts");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectSkills_Projects_ProjectId",
                table: "ProjectSkills");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectSkills_Skills_SkillId",
                table: "ProjectSkills");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Contacts",
                table: "Contacts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectSkills",
                table: "ProjectSkills");

            migrationBuilder.DropIndex(
                name: "IX_ProjectSkills_ProjectId_SkillId",
                table: "ProjectSkills");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Skills");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "Skills");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Skills");

            migrationBuilder.DropColumn(
                name: "LastModifiedBy",
                table: "Skills");

            migrationBuilder.DropColumn(
                name: "LastModifiedOn",
                table: "Skills");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "LastModifiedBy",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "LastModifiedOn",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "Instagram",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "LastModifiedBy",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "LastModifiedOn",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "ProjectSkills");

            migrationBuilder.DropColumn(
                name: "CreatedOn",
                table: "ProjectSkills");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "ProjectSkills");

            migrationBuilder.DropColumn(
                name: "LastModifiedBy",
                table: "ProjectSkills");

            migrationBuilder.DropColumn(
                name: "LastModifiedOn",
                table: "ProjectSkills");

            migrationBuilder.RenameTable(
                name: "Contacts",
                newName: "contacts");

            migrationBuilder.RenameTable(
                name: "ProjectSkills",
                newName: "ProjeProjectSkills");

            migrationBuilder.RenameIndex(
                name: "IX_Contacts_UserId",
                table: "contacts",
                newName: "IX_contacts_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectSkills_SkillId",
                table: "ProjeProjectSkills",
                newName: "IX_ProjeProjectSkills_SkillId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Skills",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Image",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(2000)",
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TikTok",
                table: "contacts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Linkedin",
                table: "contacts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Github",
                table: "contacts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Facebook",
                table: "contacts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "contacts",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AddColumn<string>(
                name: "Fnstagram",
                table: "contacts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<string>(
                name: "About",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(2000)",
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_contacts",
                table: "contacts",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjeProjectSkills",
                table: "ProjeProjectSkills",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProjeProjectSkills_ProjectId",
                table: "ProjeProjectSkills",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_contacts_AspNetUsers_UserId",
                table: "contacts",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjeProjectSkills_Projects_ProjectId",
                table: "ProjeProjectSkills",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjeProjectSkills_Skills_SkillId",
                table: "ProjeProjectSkills",
                column: "SkillId",
                principalTable: "Skills",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
