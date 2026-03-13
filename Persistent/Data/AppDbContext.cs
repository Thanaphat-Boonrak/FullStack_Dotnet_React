using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Activity = Domain.Entities.Activity;

namespace Persistent.Data;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public DbSet<Activity> Activities { get; set; }
    
    public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
    
    public DbSet<Photo> Photos { get; set; }
    
    public DbSet<Comment> Comments { get; set; } 
    
    
    public DbSet<UserFollowing>  UserFollowings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<ActivityAttendee>(k => k.HasKey(e => new { e.ActivityId, e.UserId }));
        builder.Entity<ActivityAttendee>().HasOne(x => x.User).WithMany(x => x.Activities).HasForeignKey(x => x.UserId);
        builder.Entity<ActivityAttendee>().HasOne(x => x.Activity).WithMany(x => x.Attendees).HasForeignKey(x => x.ActivityId);
        builder.Entity<UserFollowing>(x =>
        {
            x.HasKey(k => new { k.ObserverId, k.TargetId });

            x.HasOne(o => o.Observer).WithMany(o => o.Followings).HasForeignKey(o => o.ObserverId)
                .OnDelete(DeleteBehavior.Cascade);


            x.HasOne(o => o.Target).WithMany(o => o.Followers).HasForeignKey(o => o.TargetId)
                .OnDelete(DeleteBehavior.NoAction);
        });
        var dateTimeConverter = new ValueConverter<DateTime,DateTime>(v => v.ToUniversalTime(), v => DateTime.SpecifyKind(v, DateTimeKind.Utc));



        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
            }
        }
    }
}