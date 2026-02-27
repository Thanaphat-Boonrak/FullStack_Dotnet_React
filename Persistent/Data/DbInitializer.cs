using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Persistent.Data;

public static class DbInitializer
{
    public static async Task SeedData(
        AppDbContext dbContext,
        UserManager<User> userManager)
    {
        if (!userManager.Users.Any())
        {
            var users = new List<User>
            {
                new() {Id = "bob-id", DisplayName = "Bob", UserName = "bob@test.com", Email = "bob@test.com" },
                new() {Id = "tom-id", DisplayName = "Tom", UserName = "tom@test.com", Email = "tom@test.com" },
                new() {Id = "jane-id", DisplayName = "Jane", UserName = "jane@test.com", Email = "jane@test.com" }
            };

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }

      
        if (await dbContext.Activities.AnyAsync()) return;

        var dbUsers = await userManager.Users.ToListAsync();

        var bob = dbUsers.Single(x => x.UserName == "bob@test.com");
        var tom = dbUsers.Single(x => x.UserName == "tom@test.com");
        var jane = dbUsers.Single(x => x.UserName == "jane@test.com");
        
        var activities = new List<Activity>
        {
            new()
            {
                Title = "Past Activity 1",
                Date = DateTime.Now.AddMonths(-2),
                Description = "Activity 2 months ago",
                Category = "drinks",
                City = "London",
                Venue = "The Lamb and Flag",
                Latitude = 51.51171665,
                Longitude = -0.1256611057818921,
                Attendees =
                [
                    new ActivityAttendee
                    {
                        UserId = bob.Id,
                        IsHost = true
                    },
                    new ActivityAttendee
                    {
                        UserId = tom.Id
                    }
                ]
            },

            new()
            {
                Title = "Past Activity 2",
                Date = DateTime.Now.AddMonths(-1),
                Description = "Activity 1 month ago",
                Category = "culture",
                City = "Paris",
                Venue = "Louvre Museum",
                Latitude = 48.8611473,
                Longitude = 2.33802768704666,
                Attendees =
                [
                    new ActivityAttendee
                    {
                        UserId = tom.Id,
                        IsHost = true
                    },
                    new ActivityAttendee { UserId = jane.Id },
                    new ActivityAttendee { UserId = bob.Id }
                ]
            },

            new()
            {
                Title = "Future Activity 1",
                Date = DateTime.Now.AddMonths(1),
                Description = "Activity 1 month in future",
                Category = "culture",
                City = "London",
                Venue = "Natural History Museum",
                Latitude = 51.4965109,
                Longitude = -0.17600190725447445,
                Attendees =
                [
                    new ActivityAttendee
                    {
                        UserId = jane.Id,
                        IsHost = true
                    }
                ]
            },

            new()
            {
                Title = "Future Activity 2",
                Date = DateTime.Now.AddMonths(2),
                Description = "Activity 2 months in future",
                Category = "music",
                City = "London",
                Venue = "The O2",
                Latitude = 51.50293665,
                Longitude = 0.0032029278126681844,
                Attendees =
                [
                    new ActivityAttendee
                    {
                        UserId = bob.Id,
                        IsHost = true
                    },
                    new ActivityAttendee { UserId = jane.Id }
                ]
            },

            new()
            {
                Title = "Future Activity 3",
                Date = DateTime.Now.AddMonths(3),
                Description = "Activity 3 months in future",
                Category = "drinks",
                City = "London",
                Venue = "The Mayflower",
                Latitude = 51.501778,
                Longitude = -0.053577,
                Attendees =
                [
                    new ActivityAttendee
                    {
                        UserId = tom.Id,
                        IsHost = true
                    }
                ]
            }
        };
        
        await dbContext.Activities.AddRangeAsync(activities);
        await dbContext.SaveChangesAsync();
    }
}
