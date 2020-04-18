using DemiGoldAccountingWebApi.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DemiGoldAccountingWebApi.Persistence
{
    public class DemiGoldAccountingContext : IdentityDbContext<IdentityUser>
    {
        public DemiGoldAccountingContext(DbContextOptions<DemiGoldAccountingContext> options)
            : base(options)
        { }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<TransactionType> TransactionTypes { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<TextPosition> TextPositions { get; set; }
        public DbSet<Text> Texts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Client>()
                .HasAlternateKey(c => c.Name);

            builder.Entity<Employee>()
                .HasAlternateKey(e => e.Name);

            builder.Entity<Cashflow>()
                .HasAlternateKey(c => c.Name);

            builder.Entity<TransactionType>()
                .HasAlternateKey(t => t.Name);

            builder.Entity<Language>()
                .HasAlternateKey(l => l.Name);

            builder.Entity<Text>()
                .HasAlternateKey(l => l.Value);

            builder.Entity<TextPosition>()
                .HasAlternateKey(l => l.Name);

            builder.Entity<Transaction>()
                .Property(t => t.RowDeleted)
                .HasDefaultValue(false);
        }
    }
}
