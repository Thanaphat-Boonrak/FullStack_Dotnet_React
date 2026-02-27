using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent.Data;

namespace Application.Activities.Commands;

public class AddComment
{
    public class Command(string body,string activityId) : IRequest<Result<CommentDto>>
    {
        public string Body { get; set; } = body;
        public string ActivityId { get; set; } = activityId;
    }
    
    
    public class Handler(AppDbContext context,IMapper mapper , IUserAccessor userAccessor): IRequestHandler<Command, Result<CommentDto>>
    {
        public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities.FindAsync(request.ActivityId,cancellationToken);
            if (activity == null) return Result<CommentDto>.Failure("Could not find activity",400);

            var user = await userAccessor.GetUserAsync();

            var comment = new Comment()
            {
                Body = request.Body,
                ActivityId = request.ActivityId,
                UserId = user.Id,
            };
            
            context.Comments.Add(comment);
            var result = await context.SaveChangesAsync(cancellationToken) > 0;
            return result ?  Result<CommentDto>.Success(mapper.Map<CommentDto>(comment)) :  Result<CommentDto>.Failure("Could not add comment",400);
        }
    }
}