using Microsoft.EntityFrameworkCore;
using Activity = Domain.Entities.Activity;

namespace Persistent.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Activity> Activities { get; set; }
}