using Microsoft.EntityFrameworkCore;

namespace backendAPI.Models
{
     public partial class SampleDBContext : DbContext
     {
       public SampleDBContext(DbContextOptions
       <SampleDBContext> options)
           : base(options)
       {
       }
       public virtual DbSet<Customer> Customer { get; set; }
       protected override void OnModelCreating(ModelBuilder modelBuilder)
       {
           modelBuilder.Entity<Customer>(entity => {
               entity.HasKey(k => k.CustomerId);
           });
           OnModelCreatingPartial(modelBuilder);
       }
       partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
     }
}