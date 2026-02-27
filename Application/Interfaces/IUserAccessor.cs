using Domain.Entities;

namespace Application.Interfaces;

public interface IUserAccessor
{
    string GetUserId();
    Task<User> GetUserAsync();
    
    Task<User> GetUserWithPhotoAsync();
    
    
}