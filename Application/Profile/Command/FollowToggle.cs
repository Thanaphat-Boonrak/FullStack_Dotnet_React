using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Persistent.Data;

namespace Application.Profile.Command;

public class FollowToggle
{
    public class Command(string targetId) : IRequest<Result<Unit>>
    {
        public string TargetId { get; set; } = targetId;
    }


    public class Handler(IMapper mapper, IUserAccessor userAccessor, AppDbContext context)
        : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var observer = await userAccessor.GetUserAsync();
            var target = await context.Users.FindAsync([request.TargetId], cancellationToken);

            if (target == null) return Result<Unit>.Failure("No user found", 400);

            var following = await context.UserFollowings.FindAsync([observer.Id, target.Id], cancellationToken);

            if (following == null)
            {
                context.UserFollowings.Add(new UserFollowing
                {
                    ObserverId = observer.Id,
                    TargetId = target.Id
                });
            }
            else
            {
                context.UserFollowings.Remove(following);
            }

            return await context.SaveChangesAsync(cancellationToken) > 0
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Can not follow", 400);
        }
    }
}