using API.DTOs;
using Application.Core;
using Application.Interfaces;
using Application.Profile.DTOs;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistent.Data;

namespace Application.Profile.Command;

public class EditProfile
{
    public class Command(UserBioDto profile) : IRequest<Result<Unit>>
    {
        public UserBioDto Profile { get; set; } = profile;
    }
    
    public class Handler(IUserAccessor userAccessor , AppDbContext context,IMapper mapper) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
           var user = await userAccessor.GetUserAsync();

           user.Bio = request.Profile.Bio;
           user.DisplayName = request.Profile.DisplayName;
           
           var success  = await context.SaveChangesAsync(cancellationToken) > 0;
           if (!success)
               return Result<Unit>.Failure("Failed to update profile", 400);

           return Result<Unit>.Success(Unit.Value);
        }
    }

}