using Application.Core;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent.Data;

namespace Application.Activities.Commands;

public class UpdateAttendance
{
    public class Command(string id) : IRequest<Result<Unit>>
    {
        public string Id { get; set; } = id;
    }

    public class Handler(AppDbContext context,IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
          var activity = await context.Activities.Include(x => x.Attendees).ThenInclude(x => x.User)
              .SingleOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
          if(activity == null) return Result<Unit>.Failure("Activity not found",404);

          var user = await userAccessor.GetUserAsync();
          var attendence = activity.Attendees.FirstOrDefault(x => x.UserId == user.Id);
          var isHost = activity.Attendees.Any(x => x.IsHost && x.UserId == user.Id);

          if (attendence != null)
          {
              if (isHost) activity.IsCancelled = !activity.IsCancelled;
              else activity.Attendees.Remove(attendence);
          }
          else
          {
              activity.Attendees.Add(new ActivityAttendee()
              {
                  UserId = user.Id,
                  ActivityId =  activity.Id,
                  IsHost = false
              });
          }

          var result = await context.SaveChangesAsync(cancellationToken) > 0;
          return result ?  Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating activity",400);
        }
    }
}