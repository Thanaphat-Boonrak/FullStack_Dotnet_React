using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistent.Data;

namespace Application.Profile.Command;

public class AddPhoto
{
    public class Command(IFormFile file) : IRequest<Result<Photo>>
    {
        public IFormFile File { get; set; } = file;
    }

    public class Handler(IUserAccessor userAccessor , IPhotoService photoService, AppDbContext context) : IRequestHandler<Command, Result<Photo>>
    {
        public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
        {
            var uploadPhoto = await photoService.UploadPhoto(request.File);
            
            if (uploadPhoto == null) return Result<Photo>.Failure("Failed to upload photo",400);
            
            var user = await userAccessor.GetUserAsync();

            var photo = new Photo
            {
                Url = uploadPhoto.Url,
                PublicId = uploadPhoto.PublicId,
                UserId = user.Id,
            };
            
            user.ImageUrl ??= photo.Url;
            
            context.Photos.Add(photo);
            
            var result  = await context.SaveChangesAsync(cancellationToken) > 0;
            return result ? Result<Photo>.Success(photo) : Result<Photo>.Failure("Failed to upload photo", 400);
        }
    }
}