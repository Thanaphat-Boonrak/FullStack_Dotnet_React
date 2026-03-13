using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent.Data;

namespace Application.Activities.Queries;

public class GetActivityList
{
    private const int MaxPageSize = 50;
    public class Query(ActivityParams activityParams) : IRequest<Result<PageList<ActivityDto,DateTime?>>>
    {
        public ActivityParams ActivityParams = activityParams;
    }
    
    
    public class Handler(AppDbContext context,IMapper mapper,IUserAccessor accessor) : IRequestHandler<Query,Result<PageList<ActivityDto,DateTime?>>>
    {
        public async Task<Result<PageList<ActivityDto,DateTime?>>> Handle(Query request, CancellationToken cancellationToken)
        {

            var query = context.Activities.OrderBy(x => x.Date).Where(x => x.Date >= (request.ActivityParams.Cursor ?? request.ActivityParams.StartDate)).AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.ActivityParams.Filter))
            {
                query = request.ActivityParams.Filter switch
                {
                    "isGoing" => query.Where(x => x.Attendees.Any(a => a.UserId == accessor.GetUserId())),
                    "isHost" => query.Where(x => x.Attendees.Any(a => a.IsHost && a.UserId == accessor.GetUserId())),
                    _ => query
                };
                
            }

            var projectedActivities = query.ProjectTo<ActivityDto>(mapper.ConfigurationProvider,
                new { currentUserId = accessor.GetUserId() });
            
            var activities =  await projectedActivities.Take(request.ActivityParams.PageSize + 1).ToListAsync(cancellationToken);
            
            DateTime? nextCursor = null;
            if (activities.Count > request.ActivityParams.PageSize) 
            {
                nextCursor = activities.Last().Date;
                activities.RemoveAt(activities.Count - 1);
            }
            
            return Result<PageList<ActivityDto,DateTime?>>.Success(new PageList<ActivityDto, DateTime?>
            {
                Items = activities,
                NextCursor = nextCursor,
            });
        }
    }
}