
using System.Text.Json;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistent.Data;

public static class DbInitializer
{
    public static async Task SeedData(AppDbContext dbContext)
    {
        if (await dbContext.Activities.AnyAsync()) return;

        var filePath = Path.Combine(
            AppContext.BaseDirectory,
            "Data",
            "SeedData",
            "Activities.json"
        );

        var json = await File.ReadAllTextAsync(filePath);
        var options = new JsonSerializerOptions()
        {
            PropertyNameCaseInsensitive = true,
        };
        var activities = JsonSerializer.Deserialize<List<Activity>>(json,options);

        if (activities == null || activities.Count == 0) return;

        await dbContext.Activities.AddRangeAsync(activities);
        await dbContext.SaveChangesAsync();
    }
}