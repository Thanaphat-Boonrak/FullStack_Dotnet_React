using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistent.Data;

namespace Application.Activities.Queries;

public class GetActivityDetail
{
    public class Query(string id) : IRequest<Result<ActivityDto>>
    {
        public string Id { get; set; } = id;

    }


    public class Handler(AppDbContext context,IMapper mapper) : IRequestHandler<Query, Result<ActivityDto>>
    {
        public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            
            var activity = await context.Activities.ProjectTo<ActivityDto>(mapper.ConfigurationProvider).FirstOrDefaultAsync(x => request.Id == x.Id, cancellationToken);
            if(activity == null) return Result<ActivityDto>.Failure("Activity not found",404);
            return Result<ActivityDto>.Success(activity);
        }
    }
}