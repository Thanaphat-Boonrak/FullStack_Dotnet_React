using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent.Data;

namespace Application.Activities.Queries;

public class GetUserActivities
{
    public class Query(string userId , string filter)  :IRequest<Result<List<UserActivityDto>>>
    {
        public string UserId { get; set; } = userId;
        public string Filter { get; set; } = filter;
    }


    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor accessor)
        : IRequestHandler<Query, Result<List<UserActivityDto>>>
    {
        public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.ActivityAttendees.Where(u => u.UserId == request.UserId)
                .OrderBy(a => a.Activity.Date)
                .Select(a => a.Activity)
                .AsQueryable();
            var today = DateTime.UtcNow;
            query = request.Filter switch
            {
                "past" => query.Where(a => a.Date <= today && a.Attendees.Any(a => a.UserId == request.UserId)),
                "hosting" => query.Where(a => a.Attendees.Any(a => a.IsHost && a.UserId == request.UserId)),
                _ => query.Where(a => a.Date >= today && a.Attendees.Any(x => x.UserId == request.UserId))
            };

            var projectActivities = query.ProjectTo<UserActivityDto>(mapper.ConfigurationProvider);

            var actvities = await projectActivities.ToListAsync();
            return Result<List<UserActivityDto>>.Success(actvities);
        }
    }
}