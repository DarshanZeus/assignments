using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace BE_Practice.DataObjects;

public partial class ExcelCloneContext : DbContext
{
    public ExcelCloneContext()
    {
    }

    public ExcelCloneContext(DbContextOptions<ExcelCloneContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ExcelDatum> ExcelData { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;port=3306;user=root;password=PASSWORD;database=excel_clone", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.37-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<ExcelDatum>(entity =>
        {
            entity.HasKey(e => new { e.MatrixName, e.RowNo, e.ColNo })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0, 0 });

            entity.ToTable("excel_data");

            entity.HasIndex(e => new { e.MatrixName, e.ColNo, e.RowNo }, "IX_excel_data").IsUnique();

            entity.Property(e => e.MatrixName).HasMaxLength(24);
            entity.Property(e => e.CellValue).HasColumnType("text");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
