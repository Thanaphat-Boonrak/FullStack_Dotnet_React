using API.DTOs;
using Application.DTOs;
using Application.Profile.DTOs;
using AutoMapper;
using Domain.Entities;
using Microsoft.Win32.SafeHandles;

namespace Application.Core;

public class MappingProfile: AutoMapper.Profile
{
    public MappingProfile()
    {
        string? currentUserId = null;
        CreateMap<Activity, Activity>();
        CreateMap<CreateActivityDto, Activity>();
        CreateMap<EditActivityDto, Activity>();
        CreateMap<Activity, ActivityDto>().ForMember(d => d.HostDisplayName, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).User.DisplayName))
            .ForMember(d => d.HostId, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).User.Id));
        CreateMap<ActivityAttendee, UserProfile>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.Bio, o => o.MapFrom(s => s.User.Bio))
            .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl))
            .ForMember(d => d.Id, o => o.MapFrom(s => s.User.Id))
            .ForMember(u => u.IsFollowing, u => u.MapFrom(u => u.User.Followers.Any(f => f.ObserverId == currentUserId)))
            .ForMember(u => u.FollowersCount, o => o.MapFrom(u => u.User.Followers.Count))
            .ForMember(u => u.FollowingCount, o => o.MapFrom(u => u.User.Followings.Count));
        CreateMap<User,UserProfile>().ForMember(u => u.FollowersCount, o => o.MapFrom(u => u.Followers.Count)).ForMember(u => u.FollowingCount, o => o.MapFrom(u => u.Followings.Count))
            .ForMember(u => u.IsFollowing, u => u.MapFrom(u => u.Followers.Any(f => f.ObserverId == currentUserId)));
        CreateMap<User, UserBioDto>();
        CreateMap<Comment, CommentDto>().ForMember(d => d.DisplayName, o=> o.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.UserId, o => o.MapFrom(s => s.User.Id))
            .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl));
        CreateMap<Activity, UserActivityDto>();
    }
}