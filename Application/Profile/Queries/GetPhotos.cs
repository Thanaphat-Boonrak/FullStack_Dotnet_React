using Application.Core;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent.Data;

namespace Application.Profile.Queries;

public class GetPhotos
{
    public class Query(string userId) : IRequest<Result<List<Photo>>>
    {
        public string UserId { get; set; } = userId;
    }
    
    public class Handler(AppDbContext context) : IRequestHandler<Query, Result<List<Photo>>>
    {
        public async Task<Result<List<Photo>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var photos = await context.Users.Where(x => x.Id == request.UserId).SelectMany(p => p.Photos).ToListAsync(cancellationToken);
            return Result<List<Photo>>.Success(photos);
        }
    }
}