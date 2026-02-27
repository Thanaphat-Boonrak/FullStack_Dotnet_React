using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using FluentValidation;
using MediatR;
using Persistent.Data;

namespace Application.Activities.Commands;

public class CreateActivity
{
    public class Command(CreateActivityDto activity) : IRequest<Result<string>>
    {
        public CreateActivityDto ActivityDto { get; set; } = activity;
    }

    public class Handler(AppDbContext context,IMapper mapper ,IUserAccessor userAccessor) : IRequestHandler<Command,Result<string>>
    {
        public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await userAccessor.GetUserAsync();
            var activity = mapper.Map<Activity>(request.ActivityDto);
             context.Activities.Add(activity);
            var attendee = new ActivityAttendee(){ Activity = activity, UserId = user.Id, IsHost = true};
            activity.Attendees.Add(attendee);
             var result = await context.SaveChangesAsync(cancellationToken) > 0;
             return result ? Result<string>.Success(activity.Id) : Result<string>.Failure("Cannot create activity", 400);
        }
    }
}