using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistent.Data;

namespace Application.Profile.Command;

public class DeletePhoto
{
    public class Command(string photoId) : IRequest<Result<Unit>>
    {
        public string PhotoId { get; set; } = photoId;
    }
    
    public class Handler(AppDbContext context,IUserAccessor userAccessor,IPhotoService photoService) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserWithPhotoAsync();
            var photo = user.Photos.FirstOrDefault(x => x.Id == request.PhotoId);

            if (photo == null) return Result<Unit>.Failure("Cannot find Photo", 400);
            
            if(photo.Url == user.ImageUrl) return Result<Unit>.Failure("This main photo cannot be deleted",400);
            
             await photoService.DeletePhoto(photo.PublicId);
             user.Photos.Remove(photo);
            return await context.SaveChangesAsync(cancellationToken) > 0 ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to delete photo", 400);
        }
    }
}