using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistent.Data;

namespace Application.Profile.Command;

public class SetMainPhoto
{
    public class Command(string photoId) : IRequest<Result<Unit>>
    {
        public string PhotoId { get; set; } = photoId;
    }
    
    public class Handler(AppDbContext context,IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserWithPhotoAsync();
            var photo = user.Photos.FirstOrDefault(x => x.Id == request.PhotoId);

            if (photo == null) return Result<Unit>.Failure("Cannot find Photo", 400);
            
            user.ImageUrl = photo?.Url;
             
            var result = await context.SaveChangesAsync(cancellationToken) > 0;
            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Cannot set this photo to main photo", 400);
        }
    }
}