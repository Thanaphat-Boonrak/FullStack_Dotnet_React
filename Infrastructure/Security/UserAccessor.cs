using System.Security.Claims;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistent.Data;

namespace Infrastructure;

public class UserAccessor(IHttpContextAccessor httpContextAccessor, AppDbContext dbContext) : IUserAccessor
{
    public string GetUserId()
    {
        return httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("No user found");
    }

    public async Task<User> GetUserAsync()
    {
        return await dbContext.Users.FindAsync(GetUserId()) ?? throw new Exception("No user is logged in");
    }

    public async Task<User> GetUserWithPhotoAsync()
    {
        var userId = GetUserId();
        return await dbContext.Users.Include(x => x.Photos).FirstOrDefaultAsync(x => x.Id == userId) ?? throw new Exception("No user is logged in");
    }
}