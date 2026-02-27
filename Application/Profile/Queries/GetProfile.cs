using Application.Core;
using Application.Profile.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent.Data;

namespace Application.Profile.Queries;

public class GetProfile
{
    public class Query(string userId) : IRequest<Result<UserProfile>>
    {
        public string UserId { get; set; } = userId;
    }
    
    public class Handler(AppDbContext context,IMapper mapper) : IRequestHandler<Query, Result<UserProfile>>
    {
        public async Task<Result<UserProfile>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profie = await context.Users.ProjectTo<UserProfile>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);

            return profie == null ? Result<UserProfile>.Failure("No userprofile",400) : Result<UserProfile>.Success(profie);
        }
    }
}