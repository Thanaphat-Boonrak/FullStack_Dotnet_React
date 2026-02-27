using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent.Data;

namespace Application.Activities.Queries;

public class GetComments
{
    public class Query(string activityId) : IRequest<Result<List<CommentDto>>>
    {
        public string ActivityId { get; set; } = activityId;
    }

    public class Handler(IMapper mapper , AppDbContext context) : IRequestHandler<Query,Result<List<CommentDto>>>
    {
        public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var comments = await context.Comments.Where(x => x.ActivityId == request.ActivityId)
                .OrderByDescending(x => x.CreatedAt).ProjectTo<CommentDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            return Result<List<CommentDto>>.Success(comments);
        }
    }
}