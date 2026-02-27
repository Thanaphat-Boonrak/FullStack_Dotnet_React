using Application.Core;
using Domain.Entities;
using MediatR;
using Persistent.Data;

namespace Application.Activities.Commands;

public class DeleteActivity
{
    public class Command(string id) : IRequest<Result<Unit>>
    {
        public string Id { get; set; } = id;
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities.FindAsync([request.Id],cancellationToken);
            if (activity == null) return Result<Unit>.Failure("Activity not found",404);
            
            context.Activities.Remove(activity);
           var result =  await context.SaveChangesAsync(cancellationToken) > 0;
           return !result ? Result<Unit>.Failure("Failed to delete activity", 400) : Result<Unit>.Success(Unit.Value);
        }
    }
}