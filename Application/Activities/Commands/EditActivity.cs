using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Persistent.Data;

namespace Application.Activities.Commands;

public class EditActivity
{
    public class Command(EditActivityDto activity) : IRequest<Result<Unit>>
    {
        public EditActivityDto ActivityDto { get; set; } = activity;
    }
    
    public class Handler(AppDbContext context,IMapper mapper) : IRequestHandler<Command,Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities.FindAsync([request.ActivityDto.Id], cancellationToken);
            if (activity == null) return Result<Unit>.Failure("Activity not found",404);
            
            mapper.Map(request.ActivityDto, activity);
            
           var result =  await context.SaveChangesAsync(cancellationToken) > 0;
           return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update activity",400);
        }
    }
}